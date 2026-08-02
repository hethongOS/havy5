# Hermes Chat ⚡

Ứng dụng web nhỏ gọn để **trò chuyện trực tiếp với Hermes** (mô hình AI Hermes của Nous Research) — hoặc bất kỳ mô hình nào có API kiểu OpenAI.

- Không cần cài thêm thư viện nào (chỉ cần Node.js ≥ 18)
- Phản hồi dạng streaming (chữ hiện ra dần như đang gõ)
- Lưu lịch sử trò chuyện trong trình duyệt
- Có **chế độ demo** để chạy thử ngay cả khi chưa có API key
- **Phòng tranh luận** (`/arena.html`): bạn giao nhiệm vụ, hai AI persona (Cursor ⚙️ — kỹ sư thực dụng, và Hermes ⚡ — uyên bác lạc quan) tự tranh luận qua lại trước mắt bạn, bạn chen vào bất cứ lúc nào
- **Nạp Second Brain**: chỉ đường dẫn tới thư mục ghi chú cá nhân (.md/.txt), cả Hermes lẫn hai AI tranh luận sẽ đọc trước để hiểu bối cảnh và mong muốn của bạn

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

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PORT` | `3000` | Cổng chạy server |
| `HERMES_API_KEY` | *(trống)* | API key (bắt buộc với OpenRouter; không cần với Ollama local) |
| `HERMES_BASE_URL` | *(tự phát hiện Ollama, nếu không thì OpenRouter)* | Địa chỉ API kiểu OpenAI |
| `HERMES_MODEL` | *(tự chọn model Hermes trong Ollama, nếu không thì `nousresearch/hermes-3-llama-3.1-70b`)* | Tên model |
| `HERMES_SYSTEM_PROMPT` | *(tiếng Việt, thân thiện)* | Chỉ dẫn hệ thống cho Hermes |
