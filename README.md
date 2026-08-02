# Hermes Chat ⚡

Ứng dụng web nhỏ gọn để **trò chuyện trực tiếp với Hermes** (mô hình AI Hermes của Nous Research) — hoặc bất kỳ mô hình nào có API kiểu OpenAI.

- Không cần cài thêm thư viện nào (chỉ cần Node.js ≥ 18)
- Phản hồi dạng streaming (chữ hiện ra dần như đang gõ)
- Lưu lịch sử trò chuyện trong trình duyệt
- Có **chế độ demo** để chạy thử ngay cả khi chưa có API key
- **Phòng tranh luận** (`/arena.html`): bạn giao nhiệm vụ, hai AI persona (Cursor ⚙️ — kỹ sư thực dụng, và Hermes ⚡ — uyên bác lạc quan) tự tranh luận qua lại trước mắt bạn, bạn chen vào bất cứ lúc nào
- **Nạp Second Brain**: chỉ đường dẫn tới thư mục ghi chú cá nhân (.md/.txt), cả Hermes lẫn hai AI tranh luận sẽ đọc trước để hiểu bối cảnh và mong muốn của bạn
- **Văn phòng ảo** (`/office.html`): phòng làm việc chung — khai báo bao nhiêu AI cũng được trong `office.json` (Hermes qua Ollama, ChatGPT qua API key, Cursor thật qua Cursor CLI, OpenClaw qua gateway…), bạn giao việc một lần và tất cả lần lượt tham gia bàn bạc

## Chạy nhanh (có sẵn Ollama trên máy)

Nếu máy bạn đã cài [Ollama](https://ollama.com), chỉ cần:

```bash
ollama pull hermes3   # tải model Hermes 3 (chỉ cần làm 1 lần)
node server.js
```

Mở trình duyệt tại <http://localhost:3000> là chat được ngay. Server **tự động phát hiện Ollama** đang chạy và chọn model Hermes (hoặc model đầu tiên có sẵn) — không cần cấu hình gì thêm.

Nếu không có Ollama và chưa cấu hình API key, ứng dụng chạy ở **chế độ demo** (Hermes chỉ trả lời mẫu).

## Nạp Second Brain (ghi chú cá nhân) cho AI

Để cả Hermes lẫn hai AI trong Phòng tranh luận đọc ghi chú của bạn trước khi chat, truyền đường dẫn thư mục ghi chú khi khởi động:

```bash
node server.js "/duong/dan/toi/secondbrain"
```

(hoặc dùng biến môi trường: `HERMES_BRAIN="/duong/dan/toi/secondbrain" node server.js`)

- Server đọc mọi file `.md`, `.txt`, `.markdown`, `.org` trong thư mục (kể cả thư mục con), ưu tiên ghi chú sửa gần nhất
- Giới hạn 4.000 ký tự/ghi chú và 12.000 ký tự tổng (model nhỏ chạy CPU sẽ chậm nếu prompt quá dài)
- Thanh trạng thái trong app hiện `🧠 N ghi chú` khi nạp thành công
- Dữ liệu chỉ nằm trong máy bạn — không gửi đi đâu (khi dùng Ollama local)

## Các cách kết nối khác

### Dùng OpenRouter

1. Tạo API key tại [openrouter.ai/keys](https://openrouter.ai/keys)
2. Chạy:

```bash
HERMES_API_KEY=sk-or-... node server.js
```

Mặc định dùng model `nousresearch/hermes-3-llama-3.1-70b` trên OpenRouter.

### Bất kỳ API kiểu OpenAI nào khác

```bash
HERMES_BASE_URL=https://api.cua-ban.com/v1 \
HERMES_API_KEY=... \
HERMES_MODEL=ten-model \
node server.js
```

## Văn phòng ảo — mời nhiều AI vào cùng một phòng

Mở `http://localhost:3000/office.html`. Mặc định phòng có 2 persona (Cursor ⚙️ và Hermes ⚡ chạy trên model chung). Để mời AI thật của từng nền tảng, sao chép `office.config.example.json` thành `office.json` rồi sửa:

```bash
cp office.config.example.json office.json
# sửa office.json rồi khởi động lại: node server.js
```

Mỗi thành viên có một "cửa" để vào phòng:

| Thành viên | Kiểu | Cần khai báo gì |
|---|---|---|
| **Hermes** (Ollama) | `model` | `baseUrl: http://localhost:11434/v1`, `model: hermes3` — không cần key |
| **Cursor thật** | `command` | Cài [Cursor CLI](https://cursor.com/cli) (`curl https://cursor.com/install -fsS \| bash`), đăng nhập, để `cmd: cursor-agent` |
| **ChatGPT** | `model` | API key của OpenAI trong biến môi trường `OPENAI_API_KEY` (app ChatGPT desktop không có cổng cho việc này) |
| **OpenClaw** | `model` | URL gateway OpenClaw trên máy bạn (nếu gateway mở API kiểu OpenAI) |

Ghi chú: các **app desktop** (ChatGPT desktop, Hermes desktop…) là giao diện đóng — AI vào phòng qua API/CLI của nền tảng đó chứ không qua app. Thành viên kiểu `command` chạy lệnh bất kỳ: `{prompt}` trong `args` sẽ được thay bằng nội dung cuộc họp, phản hồi lấy từ stdout — nhờ đó có thể nối gần như mọi AI có CLI.

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `3000` | Cổng chạy server |
| `HERMES_API_KEY` | *(trống)* | API key (bắt buộc với OpenRouter; không cần với Ollama local) |
| `HERMES_BASE_URL` | *(tự phát hiện Ollama, nếu không thì OpenRouter)* | Địa chỉ API kiểu OpenAI |
| `HERMES_MODEL` | *(tự chọn model Hermes trong Ollama, nếu không thì `nousresearch/hermes-3-llama-3.1-70b`)* | Tên model |
| `HERMES_SYSTEM_PROMPT` | *(tiếng Việt, thân thiện)* | Chỉ dẫn hệ thống cho Hermes |
