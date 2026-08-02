import http from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.HERMES_API_KEY || "";
const OLLAMA_URL = "http://localhost:11434";

let BASE_URL = (process.env.HERMES_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/+$/, "");
let MODEL = process.env.HERMES_MODEL || "nousresearch/hermes-3-llama-3.1-70b";
let DEMO_MODE = true;

// Nếu người dùng không cấu hình gì mà máy đang chạy Ollama thì tự động dùng Ollama
async function detectConfig() {
  if (!process.env.HERMES_BASE_URL && !API_KEY) {
    try {
      const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(1500) });
      const { models = [] } = await res.json();
      const names = models.map((m) => m.name);
      const preferred =
        process.env.HERMES_MODEL ||
        names.find((n) => n.toLowerCase().includes("hermes")) ||
        names[0];
      if (preferred) {
        BASE_URL = `${OLLAMA_URL}/v1`;
        MODEL = preferred;
        DEMO_MODE = false;
        console.log(`Đã phát hiện Ollama đang chạy — dùng model "${MODEL}".`);
        return;
      }
      console.log(
        'Ollama đang chạy nhưng chưa có model nào. Hãy chạy "ollama pull hermes3" rồi khởi động lại.'
      );
    } catch {
      // Không có Ollama local — rơi xuống kiểm tra bên dưới
    }
  }
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE_URL);
  DEMO_MODE = !API_KEY && !isLocal;
}

// ---------- Second Brain: nạp ghi chú cá nhân làm ngữ cảnh cho AI ----------
// Đường dẫn lấy từ tham số dòng lệnh (node server.js /duong/dan) hoặc biến HERMES_BRAIN
const BRAIN_DIR = process.argv[2] || process.env.HERMES_BRAIN || "";
const BRAIN_EXTS = new Set([".md", ".txt", ".markdown", ".org"]);
const BRAIN_MAX_PER_FILE = 4000; // ký tự tối đa mỗi ghi chú
const BRAIN_MAX_TOTAL = 12000; // tổng ký tự tối đa (model nhỏ chạy CPU, prompt dài sẽ chậm)

let BRAIN_CONTEXT = "";
let BRAIN_FILES = 0;

async function walkDir(dir, out) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkDir(full, out);
    else if (BRAIN_EXTS.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
}

async function loadBrain() {
  if (!BRAIN_DIR) return;
  const dir = path.resolve(BRAIN_DIR);
  const files = [];
  await walkDir(dir, files);
  if (!files.length) {
    console.log(`Second Brain: không tìm thấy ghi chú (.md/.txt) nào trong "${dir}".`);
    return;
  }

  // Ưu tiên ghi chú mới sửa gần nhất
  const withTime = await Promise.all(
    files.map(async (f) => ({ f, mtime: (await stat(f)).mtimeMs }))
  );
  withTime.sort((a, b) => b.mtime - a.mtime);

  const parts = [];
  let total = 0;
  for (const { f } of withTime) {
    if (total >= BRAIN_MAX_TOTAL) break;
    let text;
    try {
      text = (await readFile(f, "utf8")).trim();
    } catch {
      continue;
    }
    if (!text) continue;
    if (text.length > BRAIN_MAX_PER_FILE) text = text.slice(0, BRAIN_MAX_PER_FILE) + "\n[...cắt bớt]";
    const chunk = `### Ghi chú: ${path.relative(dir, f)}\n${text}`;
    parts.push(chunk.slice(0, BRAIN_MAX_TOTAL - total));
    total += chunk.length;
    BRAIN_FILES++;
  }
  BRAIN_CONTEXT = parts.join("\n\n");
  console.log(`Second Brain: đã nạp ${BRAIN_FILES}/${files.length} ghi chú (${total} ký tự) từ "${dir}".`);
}

function brainSection() {
  if (!BRAIN_CONTEXT) return "";
  return (
    "\n\n--- SECOND BRAIN CỦA ANH THÀNH (ghi chú cá nhân, dùng làm bối cảnh) ---\n" +
    BRAIN_CONTEXT +
    "\n--- HẾT SECOND BRAIN ---\n" +
    "Hãy dựa vào các ghi chú trên để hiểu bối cảnh, mục tiêu và mong muốn của anh Thành khi trả lời."
  );
}

const SYSTEM_PROMPT =
  process.env.HERMES_SYSTEM_PROMPT ||
  "Bạn là Hermes, một trợ lý AI thân thiện và thông minh. Hãy trả lời bằng ngôn ngữ mà người dùng sử dụng (mặc định là tiếng Việt).";

// Hai persona cho Phòng tranh luận — cùng chạy trên một model nhưng tính cách khác nhau
const ARENA_RULES =
  "Bạn đang ở trong một phòng chat nhóm cùng anh Thành (con người, người giao nhiệm vụ) " +
  "và một AI khác. Hãy tranh luận thẳng thắn bằng tiếng Việt: nêu rõ chính kiến, phản biện " +
  "trực tiếp ý kiến của AI kia (gọi thẳng tên), và khi cần thì đặt câu hỏi ngược lại. " +
  "Luôn tôn trọng và làm theo yêu cầu mới nhất của anh Thành. Mỗi lượt nói TỐI ĐA 4 câu, " +
  "xưng \"mình\". Chỉ viết nội dung lượt nói của chính bạn — không viết tên bạn ở đầu, " +
  "không đóng vai người khác, không viết thay lượt của ai.";

const PERSONAS = {
  cursor: {
    name: "Cursor",
    prompt:
      "Bạn là Cursor, một AI kỹ sư thực dụng: logic, hoài nghi, coi trọng số liệu, tính khả thi " +
      "và rủi ro. Bạn hay chỉ ra điểm yếu trong lập luận của người khác. " +
      ARENA_RULES,
  },
  hermes: {
    name: "Hermes",
    prompt:
      "Bạn là Hermes, một AI uyên bác và lạc quan: giàu trí tưởng tượng, coi trọng ý tưởng lớn, " +
      "trải nghiệm con người và khả năng sáng tạo. Bạn bảo vệ quan điểm của mình một cách khéo léo. " +
      ARENA_RULES,
  },
};

// ---------- Văn phòng ảo: phòng chat nhóm với các AI khai báo trong office.json ----------
const OFFICE_FILE = path.join(__dirname, "office.json");
let OFFICE_PARTICIPANTS = [];

function officeRules(selfName, allNames) {
  const others = allNames.filter((n) => n !== selfName).join(", ");
  return (
    `Bạn là ${selfName}, một thành viên AI trong "Văn phòng ảo" — phòng làm việc nhóm gồm ` +
    `anh Thành (con người, sếp giao việc) và các AI: ${others}. ` +
    "Hãy làm việc bằng tiếng Việt: đóng góp ý kiến thực chất, phản hồi trực tiếp ý của thành viên khác " +
    "(gọi thẳng tên), và luôn ưu tiên yêu cầu mới nhất của anh Thành. Mỗi lượt nói TỐI ĐA 4 câu, " +
    'xưng "mình". Chỉ viết nội dung lượt nói của chính bạn — không viết tên bạn ở đầu, ' +
    "không đóng vai người khác."
  );
}

async function loadOffice() {
  let cfg = null;
  try {
    cfg = JSON.parse(await readFile(OFFICE_FILE, "utf8"));
  } catch {
    // Không có office.json — dùng đội hình mặc định bên dưới
  }

  if (cfg && Array.isArray(cfg.participants) && cfg.participants.length) {
    OFFICE_PARTICIPANTS = cfg.participants.filter(
      (p) => p && typeof p.id === "string" && typeof p.name === "string" &&
        ["model", "command"].includes(p.type)
    );
    console.log(
      `Văn phòng ảo: ${OFFICE_PARTICIPANTS.length} thành viên AI từ office.json — ` +
      OFFICE_PARTICIPANTS.map((p) => p.name).join(", ")
    );
  } else {
    // Mặc định: hai persona Cursor/Hermes chạy trên model chung
    OFFICE_PARTICIPANTS = [
      {
        id: "cursor", name: "Cursor", icon: "⚙️", type: "model",
        persona: "Tính cách: kỹ sư thực dụng, logic, hoài nghi, coi trọng tính khả thi và rủi ro.",
      },
      {
        id: "hermes", name: "Hermes", icon: "⚡", type: "model",
        persona: "Tính cách: uyên bác, lạc quan, giàu trí tưởng tượng, coi trọng ý tưởng lớn.",
      },
    ];
  }
}

function resolveApiKey(p) {
  if (p.apiKey) return p.apiKey;
  if (p.apiKeyEnv) return process.env[p.apiKeyEnv] || "";
  return "";
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload quá lớn"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function startSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
}

function sseSend(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function streamDemoReply(res, lastUserMessage) {
  const reply =
    `Xin chào! Mình là Hermes (chế độ demo). Bạn vừa nói: "${lastUserMessage}".\n\n` +
    "Hiện server chưa kết nối được với mô hình nào nên mình chỉ trả lời mẫu. " +
    "Nếu máy bạn có Ollama, hãy chạy \"ollama pull hermes3\" rồi khởi động lại server — " +
    "mình sẽ tự động kết nối. Hoặc đặt biến môi trường HERMES_API_KEY (key của OpenRouter). " +
    "Xem hướng dẫn chi tiết trong README.md nhé!";
  startSSE(res);
  for (const word of reply.split(/(?<= )/)) {
    sseSend(res, "delta", { content: word });
    await new Promise((r) => setTimeout(r, 25));
  }
  sseSend(res, "done", { demo: true });
  res.end();
}

// Gọi API kiểu OpenAI và chuyển tiếp kết quả streaming về client dưới dạng SSE.
// opts cho phép ghi đè baseUrl/model/apiKey theo từng thành viên Văn phòng ảo.
async function proxyCompletion(res, messages, opts = {}) {
  const baseUrl = (opts.baseUrl || BASE_URL).replace(/\/+$/, "");
  const model = opts.model || MODEL;
  const apiKey = opts.apiKey ?? API_KEY;
  let upstream;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ model, stream: true, messages }),
    });
  } catch (err) {
    return sendJSON(res, 502, { error: `Không kết nối được tới ${baseUrl}: ${err.message}` });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return sendJSON(res, upstream.status, {
      error: `API trả về lỗi ${upstream.status}: ${text.slice(0, 500)}`,
    });
  }

  startSSE(res);
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) sseSend(res, "delta", { content: delta });
        } catch {
          // bỏ qua các dòng keep-alive / không phải JSON
        }
      }
    }
    sseSend(res, "done", {});
  } catch (err) {
    sseSend(res, "error", { error: err.message });
  }
  res.end();
}

async function handleChat(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return sendJSON(res, 400, { error: "JSON không hợp lệ" });
  }
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const valid = messages.every(
    (m) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string"
  );
  if (!messages.length || !valid) {
    return sendJSON(res, 400, { error: "Trường messages không hợp lệ" });
  }

  if (DEMO_MODE) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return streamDemoReply(res, lastUser ? lastUser.content : "");
  }

  return proxyCompletion(res, [
    { role: "system", content: SYSTEM_PROMPT + brainSection() },
    ...messages,
  ]);
}

// Một lượt phát biểu trong Phòng tranh luận: nhận toàn bộ hội thoại nhóm,
// trả về lượt nói tiếp theo của persona được chỉ định (streaming)
async function handleArenaTurn(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return sendJSON(res, 400, { error: "JSON không hợp lệ" });
  }
  const persona = PERSONAS[payload.speaker];
  const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
  const valid = transcript.every(
    (t) => t && typeof t.name === "string" && typeof t.content === "string"
  );
  if (!persona || !transcript.length || !valid) {
    return sendJSON(res, 400, { error: "Trường speaker hoặc transcript không hợp lệ" });
  }

  if (DEMO_MODE) {
    return streamDemoReply(res, transcript[transcript.length - 1].content);
  }

  const log = transcript.map((t) => `${t.name}: ${t.content}`).join("\n\n");
  return proxyCompletion(res, [
    { role: "system", content: persona.prompt + brainSection() },
    {
      role: "user",
      content:
        `Cuộc trò chuyện trong phòng đến lúc này:\n\n${log}\n\n` +
        `Bây giờ đến lượt bạn (${persona.name}). Viết đúng một lượt nói của bạn, không kèm tên ở đầu.`,
    },
  ]);
}

// Thành viên kiểu "command": chạy một CLI (ví dụ cursor-agent) để lấy lượt trả lời,
// stream stdout về client theo thời gian thực
function runCommandTurn(res, participant, prompt) {
  const args = (participant.args || []).map((a) => a.replaceAll("{prompt}", prompt));
  let child;
  try {
    child = spawn(participant.cmd, args, { timeout: 300_000 });
  } catch (err) {
    return sendJSON(res, 500, { error: `Không chạy được lệnh "${participant.cmd}": ${err.message}` });
  }

  startSSE(res);
  const decoder = new TextDecoder();
  let sentAny = false;
  child.stdout.on("data", (chunk) => {
    const text = decoder.decode(chunk, { stream: true });
    if (text) {
      sentAny = true;
      sseSend(res, "delta", { content: text });
    }
  });
  let errText = "";
  child.stderr.on("data", (chunk) => (errText += chunk));
  child.on("error", (err) => {
    sseSend(res, "error", { error: `Lỗi lệnh "${participant.cmd}": ${err.message}` });
    res.end();
  });
  child.on("close", (code) => {
    if (!sentAny && code !== 0) {
      sseSend(res, "error", {
        error: `Lệnh "${participant.cmd}" thoát mã ${code}: ${errText.slice(0, 300)}`,
      });
    } else {
      sseSend(res, "done", {});
    }
    res.end();
  });
}

// Một lượt phát biểu trong Văn phòng ảo: định tuyến tới đúng "cửa" của thành viên
async function handleOfficeTurn(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return sendJSON(res, 400, { error: "JSON không hợp lệ" });
  }
  const p = OFFICE_PARTICIPANTS.find((x) => x.id === payload.speaker);
  const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
  const valid = transcript.every(
    (t) => t && typeof t.name === "string" && typeof t.content === "string"
  );
  if (!p || !transcript.length || !valid) {
    return sendJSON(res, 400, { error: "Trường speaker hoặc transcript không hợp lệ" });
  }

  const allNames = OFFICE_PARTICIPANTS.map((x) => x.name);
  const systemPrompt =
    officeRules(p.name, allNames) +
    (p.persona ? `\n${p.persona}` : "") +
    brainSection();
  const log = transcript.map((t) => `${t.name}: ${t.content}`).join("\n\n");
  const turnRequest =
    `Cuộc trò chuyện trong văn phòng đến lúc này:\n\n${log}\n\n` +
    `Bây giờ đến lượt bạn (${p.name}). Viết đúng một lượt nói của bạn, không kèm tên ở đầu.`;

  if (p.type === "command") {
    return runCommandTurn(res, p, `${systemPrompt}\n\n${turnRequest}`);
  }

  // type "model": nếu không khai baseUrl riêng và server đang ở chế độ demo thì trả lời mẫu
  if (!p.baseUrl && DEMO_MODE) {
    return streamDemoReply(res, transcript[transcript.length - 1].content);
  }
  return proxyCompletion(
    res,
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: turnRequest },
    ],
    { baseUrl: p.baseUrl, model: p.model, apiKey: p.baseUrl ? resolveApiKey(p) : undefined }
  );
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (req.method === "GET" && pathname === "/api/config") {
    return sendJSON(res, 200, {
      model: MODEL,
      demoMode: DEMO_MODE,
      baseUrl: BASE_URL,
      brainFiles: BRAIN_FILES,
    });
  }
  if (req.method === "POST" && pathname === "/api/chat") {
    return handleChat(req, res);
  }
  if (req.method === "POST" && pathname === "/api/arena/turn") {
    return handleArenaTurn(req, res);
  }
  if (req.method === "GET" && pathname === "/api/office/config") {
    return sendJSON(res, 200, {
      demoMode: DEMO_MODE,
      brainFiles: BRAIN_FILES,
      participants: OFFICE_PARTICIPANTS.map((p) => ({
        id: p.id,
        name: p.name,
        icon: p.icon || "🤖",
        type: p.type,
        model: p.type === "model" ? p.model || MODEL : undefined,
      })),
    });
  }
  if (req.method === "POST" && pathname === "/api/office/turn") {
    return handleOfficeTurn(req, res);
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }
  res.writeHead(405).end("Method not allowed");
});

await detectConfig();
await loadBrain();
await loadOffice();

server.listen(PORT, () => {
  console.log(`Hermes Chat đang chạy tại http://localhost:${PORT}`);
  console.log(`  Model   : ${MODEL}`);
  console.log(`  Endpoint: ${BASE_URL}`);
  console.log(`  Chế độ  : ${DEMO_MODE ? "DEMO (chưa có API key / Ollama)" : "KẾT NỐI THẬT"}`);
  console.log(`  Brain   : ${BRAIN_FILES ? `${BRAIN_FILES} ghi chú Second Brain` : "chưa nạp (truyền đường dẫn để nạp)"}`);
});
