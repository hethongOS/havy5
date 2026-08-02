# Hermes Chat ⚡

Ứng dụng web nhỏ gọn để **trò chuyện trực tiếp với Hermes** (mô hình AI Hermes của Nous Research) — hoặc bất kỳ mô hình nào có API kiểu OpenAI.

- Không cần cài thêm thư viện nào (chỉ cần Node.js ≥ 18)
- Phản hồi dạng streaming (chữ hiện ra dần như đang gõ)
- Lưu lịch sử trò chuyện trong trình duyệt
- Có **chế độ demo** để chạy thử ngay cả khi chưa có API key

## Chạy nhanh

```bash
node server.js
```

Mở trình duyệt tại <http://localhost:3000>. Nếu chưa cấu hình gì, ứng dụng chạy ở **chế độ demo** (Hermes chỉ trả lời mẫu).

## Kết nối với Hermes thật

### Cách 1: Dùng OpenRouter (dễ nhất)

1. Tạo API key tại [openrouter.ai/keys](https://openrouter.ai/keys)
2. Chạy:

```bash
HERMES_API_KEY=sk-or-... node server.js
```

Mặc định dùng model `nousresearch/hermes-3-llama-3.1-70b` trên OpenRouter.

### Cách 2: Chạy Hermes local bằng Ollama (miễn phí, không cần key)

1. Cài [Ollama](https://ollama.com) rồi tải model:

```bash
ollama pull hermes3
```

2. Chạy server trỏ tới Ollama:

```bash
HERMES_BASE_URL=http://localhost:11434/v1 HERMES_MODEL=hermes3 node server.js
```

### Cách 3: Bất kỳ API kiểu OpenAI nào khác

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
| `HERMES_BASE_URL` | `https://openrouter.ai/api/v1` | Địa chỉ API kiểu OpenAI |
| `HERMES_MODEL` | `nousresearch/hermes-3-llama-3.1-70b` | Tên model |
| `HERMES_SYSTEM_PROMPT` | *(tiếng Việt, thân thiện)* | Chỉ dẫn hệ thống cho Hermes |
