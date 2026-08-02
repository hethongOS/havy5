const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send-btn");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear-btn");

const STORAGE_KEY = "hermes-chat-history";
let history = [];
let busy = false;

// Nội dung màn hình chào — tagline và gợi ý do Hermes cùng chốt
const WELCOME_HTML = `
  <div class="welcome">
    <div class="welcome-icon">⚡</div>
    <h2>Chào bạn, mình là Hermes!</h2>
    <p>Người bạn AI của bạn — hỏi gì cũng được!</p>
    <div class="suggestions">
      <button class="chip">Kể mình một sự thật thú vị đi</button>
      <button class="chip">Viết giúp mình một bài thơ ngắn</button>
      <button class="chip">Gợi ý món ăn tối nay nhé</button>
      <button class="chip">AI hoạt động như thế nào vậy?</button>
    </div>
  </div>`;

function loadHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      history = saved;
      messagesEl.innerHTML = "";
      for (const m of history) addBubble(m.role, m.content);
    }
  } catch {
    history = [];
  }
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-60)));
}

function addBubble(role, text = "") {
  const welcome = messagesEl.querySelector(".welcome");
  if (welcome) welcome.remove();
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function showTyping(bubble) {
  bubble.innerHTML =
    '<span class="typing"><span></span><span></span><span></span></span>';
}

async function fetchConfig() {
  try {
    const res = await fetch("/api/config");
    const cfg = await res.json();
    const brain = cfg.brainFiles ? ` · 🧠 ${cfg.brainFiles} ghi chú` : "";
    if (cfg.demoMode) {
      statusEl.textContent = "Chế độ demo — chưa cấu hình API key";
      statusEl.classList.add("demo");
    } else {
      statusEl.textContent = `Trực tuyến · ${cfg.model}${brain}`;
    }
  } catch {
    statusEl.textContent = "Không kết nối được server";
  }
}

async function sendMessage(text) {
  busy = true;
  sendBtn.disabled = true;
  history.push({ role: "user", content: text });
  addBubble("user", text);
  saveHistory();

  const bubble = addBubble("assistant");
  showTyping(bubble);
  let reply = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok || !res.headers.get("content-type")?.includes("text/event-stream")) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Các sự kiện SSE ngăn cách nhau bằng dòng trống
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
          bubble.textContent = reply;
          messagesEl.scrollTop = messagesEl.scrollHeight;
        } else if (eventName === "error") {
          throw new Error(parsed.error || "Lỗi không xác định");
        }
      }
    }

    if (!reply) throw new Error("Không nhận được phản hồi nào từ mô hình.");
    history.push({ role: "assistant", content: reply });
    saveHistory();
  } catch (err) {
    bubble.remove();
    addBubble("error", `⚠️ ${err.message}`);
    // bỏ tin nhắn user cuối để có thể gửi lại
    history.pop();
    saveHistory();
  } finally {
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || busy) return;
  input.value = "";
  input.style.height = "auto";
  sendMessage(text);
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

clearBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem(STORAGE_KEY);
  messagesEl.innerHTML = WELCOME_HTML;
  input.focus();
});

messagesEl.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip && !busy) sendMessage(chip.textContent.trim());
});

fetchConfig();
loadHistory();
