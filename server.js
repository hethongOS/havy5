import http from "node:http";
import { readFile } from "node:fs/promises";
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

const SYSTEM_PROMPT =
  process.env.HERMES_SYSTEM_PROMPT ||
  "Bạn là Hermes, một trợ lý AI thân thiện và thông minh. Hãy trả lời bằng ngôn ngữ mà người dùng sử dụng (mặc định là tiếng Việt).";

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

  let upstream;
  try {
    upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
  } catch (err) {
    return sendJSON(res, 502, { error: `Không kết nối được tới ${BASE_URL}: ${err.message}` });
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

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (req.method === "GET" && pathname === "/api/config") {
    return sendJSON(res, 200, { model: MODEL, demoMode: DEMO_MODE, baseUrl: BASE_URL });
  }
  if (req.method === "POST" && pathname === "/api/chat") {
    return handleChat(req, res);
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }
  res.writeHead(405).end("Method not allowed");
});

await detectConfig();

server.listen(PORT, () => {
  console.log(`Hermes Chat đang chạy tại http://localhost:${PORT}`);
  console.log(`  Model   : ${MODEL}`);
  console.log(`  Endpoint: ${BASE_URL}`);
  console.log(`  Chế độ  : ${DEMO_MODE ? "DEMO (chưa có API key / Ollama)" : "KẾT NỐI THẬT"}`);
});
