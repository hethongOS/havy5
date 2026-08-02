# Hermes Chat ⚡

Ứng dụng web nhỏ gọn để **trò chuyện trực tiếp với Hermes** (mô hình AI Hermes của Nous Research) — hoặc bất kỳ mô hình nào có API kiểu OpenAI.

- Không cần cài thêm thư viện nào (chỉ cần Node.js ≥ 18)
- Phản hồi dạng streaming (chữ hiện ra dần như đang gõ)
- Lưu lịch sử trò chuyện trong trình duyệt
- Có **chế độ demo** để chạy thử ngay cả khi chưa có API key

## Chạy nhanh (có sẵn Ollama trên máy)

Nếu máy bạn đã cài [Ollama](https://ollama.com), chỉ cần:

```bash
ollama pull hermes3   # tải model Hermes 3 (chỉ cần làm 1 lần)
node server.js
```

Mở trình duyệt tại <http://localhost:3000> là chat được ngay. Server **tự động phát hiện Ollama** đang chạy và chọn model Hermes (hoặc model đầu tiên có sẵn) — không cần cấu hình gì thêm.

Nếu không có Ollama và chưa cấu hình API key, ứng dụng chạy ở **chế độ demo** (Hermes chỉ trả lời mẫu).

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
