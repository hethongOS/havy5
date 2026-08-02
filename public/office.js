const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear-btn");
const stopBtn = document.getElementById("stop-btn");
const participantsEl = document.getElementById("participants");

const STORAGE_KEY = "hermes-office-history";
const ROUNDS_PER_PROMPT = 2; // mỗi AI nói tối đa 2 lượt sau mỗi tin nhắn của người dùng
const USER_NAME = "Anh Thành";
const PALETTE = ["#3dd6c3", "#f5a524", "#b18cff", "#ff8fb3", "#7ee787", "#6fb8ff"];

let participants = []; // [{id, name, icon, color}]
let transcript = [];
let debating = false;
let stopRequested = false;

const WELCOME_HTML = document.querySelector(".welcome").outerHTML;

function saveTranscript() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transcript.slice(-100)));
}

function byName(name) {
  return participants.find((p) => p.name === name) || null;
}

function addBubble(name, text = "") {
  const welcome = messagesEl.querySelector(".welcome");
  if (welcome) welcome.remove();
  const agent = byName(name);
  const div = document.createElement("div");
  div.className = agent ? "msg assistant" : "msg user";
  if (agent) {
    div.style.borderLeft = `3px solid ${agent.color}`;
    const label = document.createElement("div");
    label.className = "speaker-label";
    label.style.color = agent.color;
    label.textContent = `${agent.icon} ${agent.name}`;
    div.appendChild(label);
  }
  const body = document.createElement("div");
  body.className = "msg-body";
  body.textContent = text;
  div.appendChild(body);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return body;
}

function addNote(text) {
  const div = document.createElement("div");
  div.className = "note";
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping(el) {
  el.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
}

async function fetchConfig() {
  try {
    const res = await fetch("/api/office/config");
    const cfg = await res.json();
    participants = cfg.participants.map((p, i) => ({
      ...p,
      color: PALETTE[i % PALETTE.length],
    }));
    participantsEl.innerHTML = "";
    const userBadge = document.createElement("span");
    userBadge.className = "badge badge-user";
    userBadge.textContent = USER_NAME;
    participantsEl.appendChild(userBadge);
    for (const p of participants) {
      const b = document.createElement("span");
      b.className = "badge";
      b.style.borderColor = p.color;
      b.style.color = p.color;
      b.textContent = `${p.icon} ${p.name}`;
      participantsEl.appendChild(b);
      p.badgeEl = b;
    }
    const brain = cfg.brainFiles ? ` · 🧠 ${cfg.brainFiles} ghi chú` : "";
    statusEl.textContent = cfg.demoMode
      ? "Chế độ demo — cần Ollama hoặc API key"
      : `${participants.length} AI trong phòng${brain}`;
    if (cfg.demoMode) statusEl.classList.add("demo");
  } catch {
    statusEl.textContent = "Không kết nối được server";
  }
}

function stripNamePrefix(text) {
  const names = participants.map((p) => p.name).join("|");
  return text.replace(new RegExp(`^\\s*(${names})\\s*[:\\-–]\\s*`, "i"), "");
}

async function agentTurn(agent) {
  const body = addBubble(agent.name);
  showTyping(body);
  let reply = "";

  const res = await fetch("/api/office/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ speaker: agent.id, transcript }),
  });

  if (!res.ok || !res.headers.get("content-type")?.includes("text/event-stream")) {
    const err = await res.json().catch(() => ({}));
    body.parentElement.remove();
    throw new Error(`${agent.name}: ${err.error || `lỗi máy chủ (${res.status})`}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop();
    for (const raw of events) {
      let eventName = "message";
      let data = "";
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;
      const parsed = JSON.parse(data);
      if (eventName === "delta" && parsed.content) {
        reply += parsed.content;
        body.textContent = stripNamePrefix(reply);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      } else if (eventName === "error") {
        throw new Error(`${agent.name}: ${parsed.error || "lỗi không xác định"}`);
      }
    }
  }

  const finalText = stripNamePrefix(reply).trim();
  if (!finalText) {
    body.parentElement.remove();
    throw new Error(`${agent.name}: không nhận được phản hồi.`);
  }
  body.textContent = finalText;
  transcript.push({ name: agent.name, content: finalText });
  saveTranscript();
}

function disableParticipant(p) {
  p.disabled = true;
  if (p.badgeEl) {
    p.badgeEl.style.opacity = "0.35";
    p.badgeEl.title = "Thành viên này gặp lỗi và tạm rời phòng";
  }
}

// Vòng họp: mỗi AI còn hoạt động phát biểu lần lượt; AI nào lỗi thì
// tạm rời phòng và các thành viên khác vẫn tiếp tục
async function runMeeting() {
  const enabled = participants.filter((p) => !p.disabled);
  if (debating || !enabled.length) return;
  debating = true;
  stopRequested = false;
  stopBtn.hidden = false;

  // Bắt đầu từ AI đứng sau người vừa nói gần nhất
  const lastAgent = [...transcript].reverse().find((t) => byName(t.name));
  let idx = lastAgent
    ? (participants.findIndex((p) => p.name === lastAgent.name) + 1) % participants.length
    : 0;

  const maxTurns = enabled.length * ROUNDS_PER_PROMPT;
  let spoken = 0;
  try {
    while (spoken < maxTurns && !stopRequested) {
      const p = participants[idx];
      idx = (idx + 1) % participants.length;
      if (p.disabled) continue;
      try {
        await agentTurn(p);
        spoken++;
      } catch (err) {
        disableParticipant(p);
        addNote(`⚠️ ${err.message} — ${p.name} tạm rời phòng, các AI khác tiếp tục.`);
        if (participants.every((x) => x.disabled)) break;
      }
      if (!stopRequested && spoken < maxTurns) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    if (participants.every((x) => x.disabled)) {
      addNote(
        "⚠️ Tất cả AI trong phòng đều gặp lỗi. Kiểm tra Ollama (ollama list) và cấu hình office.json, " +
        "khởi động lại server rồi tải lại trang."
      );
    } else if (!stopRequested) {
      addNote("— Cả văn phòng tạm nghỉ, chờ anh Thành nhắn tiếp —");
    }
  } finally {
    debating = false;
    stopBtn.hidden = true;
    input.focus();
  }
}

function sendUserMessage(text) {
  transcript.push({ name: USER_NAME, content: text });
  addBubble(USER_NAME, text);
  saveTranscript();
  if (debating) {
    addNote("— Anh Thành vừa chen vào, các AI sẽ tiếp thu ở lượt kế —");
  } else {
    runMeeting();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  input.style.height = "auto";
  sendUserMessage(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

stopBtn.addEventListener("click", () => {
  stopRequested = true;
  stopBtn.hidden = true;
});

clearBtn.addEventListener("click", () => {
  stopRequested = true;
  transcript = [];
  localStorage.removeItem(STORAGE_KEY);
  messagesEl.innerHTML = WELCOME_HTML;
  input.focus();
});

function loadTranscript() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      transcript = saved;
      messagesEl.innerHTML = "";
      for (const t of transcript) addBubble(t.name, t.content);
    }
  } catch {
    transcript = [];
  }
}

(async () => {
  await fetchConfig();
  loadTranscript();
})();
