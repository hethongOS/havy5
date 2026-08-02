const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send-btn");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear-btn");
const stopBtn = document.getElementById("stop-btn");

const STORAGE_KEY = "hermes-arena-history";
const MAX_AGENT_TURNS = 6; // số lượt AI nói liên tiếp sau mỗi tin nhắn của người dùng

const USER_NAME = "Anh Thành";
const AGENTS = {
  cursor: { name: "Cursor", cls: "agent-cursor", icon: "⚙️" },
  hermes: { name: "Hermes", cls: "agent-hermes", icon: "⚡" },
};

let transcript = []; // [{name, content}]
let debating = false;
let stopRequested = false;

const WELCOME_HTML = document.querySelector(".welcome").outerHTML;

function saveTranscript() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transcript.slice(-80)));
}

function speakerInfo(name) {
  if (name === AGENTS.cursor.name) return AGENTS.cursor;
  if (name === AGENTS.hermes.name) return AGENTS.hermes;
  return null;
}

function addBubble(name, text = "") {
  const welcome = messagesEl.querySelector(".welcome");
  if (welcome) welcome.remove();
  const agent = speakerInfo(name);
  const div = document.createElement("div");
  div.className = agent ? `msg assistant ${agent.cls}` : "msg user";
  if (agent) {
    const label = document.createElement("div");
    label.className = "speaker-label";
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
    const res = await fetch("/api/config");
    const cfg = await res.json();
    if (cfg.demoMode) {
      statusEl.textContent = "Chế độ demo — cần Ollama hoặc API key để tranh luận thật";
      statusEl.classList.add("demo");
    } else {
      statusEl.textContent = `Trực tuyến · ${cfg.model}`;
    }
  } catch {
    statusEl.textContent = "Không kết nối được server";
  }
}

// Xin một lượt phát biểu của agent, stream vào bong bóng chat
async function agentTurn(speakerId) {
  const agent = AGENTS[speakerId];
  const body = addBubble(agent.name);
  showTyping(body);
  let reply = "";

  const res = await fetch("/api/arena/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ speaker: speakerId, transcript }),
  });

  if (!res.ok || !res.headers.get("content-type")?.includes("text/event-stream")) {
    const err = await res.json().catch(() => ({}));
    body.parentElement.remove();
    throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
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
        // Bỏ tiền tố "Tên:" nếu model lỡ thêm vào
        body.textContent = reply.replace(/^\s*(Cursor|Hermes)\s*[:\-–]\s*/i, "");
        messagesEl.scrollTop = messagesEl.scrollHeight;
      } else if (eventName === "error") {
        throw new Error(parsed.error || "Lỗi không xác định");
      }
    }
  }

  const finalText = reply.replace(/^\s*(Cursor|Hermes)\s*[:\-–]\s*/i, "").trim();
  if (!finalText) {
    body.parentElement.remove();
    throw new Error("Không nhận được phản hồi nào từ mô hình.");
  }
  body.textContent = finalText;
  transcript.push({ name: agent.name, content: finalText });
  saveTranscript();
}

// Vòng tranh luận: hai AI thay phiên nhau nói cho đến khi đạt giới hạn hoặc bị dừng
async function runDebate() {
  if (debating) return;
  debating = true;
  stopRequested = false;
  stopBtn.hidden = false;

  // Agent nào chưa nói ở lượt gần nhất sẽ nói trước
  const lastAgent = [...transcript].reverse().find((t) => speakerInfo(t.name));
  let next = lastAgent && lastAgent.name === AGENTS.cursor.name ? "hermes" : "cursor";

  try {
    for (let i = 0; i < MAX_AGENT_TURNS && !stopRequested; i++) {
      await agentTurn(next);
      next = next === "cursor" ? "hermes" : "cursor";
      if (!stopRequested && i < MAX_AGENT_TURNS - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
    if (!stopRequested) {
      addNote("— Hai AI tạm nghỉ, chờ anh Thành nhắn tiếp —");
    }
  } catch (err) {
    addNote(`⚠️ ${err.message}`);
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
    // Đang tranh luận: tin nhắn đã vào transcript, các lượt sau sẽ tự thấy
    addNote("— Anh Thành vừa chen vào, hai AI sẽ tiếp thu ở lượt kế —");
  } else {
    runDebate();
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

messagesEl.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip && !debating) sendUserMessage(chip.textContent.trim());
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

fetchConfig();
loadTranscript();
