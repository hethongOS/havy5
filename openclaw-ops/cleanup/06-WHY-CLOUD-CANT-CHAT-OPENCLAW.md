# Để Cursor chat / điều khiển được OpenClaw Desktop

OpenClaw **có Desktop + Gateway** (thường `ws://127.0.0.1:18789`).  
Vấn đề không phải “OpenClaw thiếu chat” — mà là **phiên Cursor Cloud này chưa được cắm cầu MCP tới Gateway trên máy anh**.

## Vì sao Hermes / GPT chat được, còn em (cloud) thì không

| Kênh | Chạy ở đâu | Thấy ổ O / Gateway chưa |
|---|---|---|
| OpenClaw Desktop / WebChat | Máy anh | Có |
| Cursor Desktop + MCP OpenClaw | Máy anh | Có nếu đã cấu hình `mcp.json` |
| GPT/Hermes session trên máy | Máy anh | Có |
| **Cursor Cloud agent (phiên này)** | Máy ảo remote | **Không** — chỉ có MCP `cursor-cloud`, chưa có MCP `openclaw` |

Kiểm tra trong phiên cloud hiện tại: catalog MCP chỉ có `cursor-cloud`. Không có server OpenClaw → không gọi được tool chat/agent của Gateway.

## Cách 1 (nhanh nhất): chat trên máy anh

1. Mở **OpenClaw Desktop / WebChat** trên máy có `O:\OPENCLAW`.
2. Dán prompt trong `cleanup/05-OPENCLAW-SELF-EVAL-DIRECTIVE.md`.
3. OpenClaw tự `agents list` / `skills check` / đề xuất xóa → anh duyệt token.

## Cách 2: Cursor Desktop local gắn MCP OpenClaw

Trên máy anh, thêm vào `~/.cursor/mcp.json` (hoặc Cursor Settings → MCP):

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "openclaw",
      "args": [
        "mcp",
        "serve",
        "--url",
        "ws://127.0.0.1:18789",
        "--token-file",
        "C:/path/to/gateway.token"
      ]
    }
  }
}
```

Điều kiện:
- Gateway đang chạy
- CLI `openclaw` có trong PATH
- Token đúng (dùng `--token-file`, không paste token vào chat)

Sau đó mở **Cursor Agent trên Desktop** (không phải Cloud) → agent sẽ thấy MCP OpenClaw và chat/điều khiển được.

## Cách 3: Cloud muốn điều khiển được (cần anh mở đường)

Gateway mặc định chỉ lắng nghe **localhost**. Cloud muốn vào thì cần một trong các cách:

1. **Tailscale / VPN** + URL `wss://...:18789` + token  
2. **SSH tunnel** từ môi trường agent tới máy anh (thường Cloud không có SSH vào PC anh)  
3. Chạy agent bằng **Cursor Desktop / private worker trên máy anh** thay vì Cloud thuần

Rồi đăng ký MCP OpenClaw trong môi trường agent đó. Không cấu hình cầu này thì Cloud **không thể** “chat như Desktop”.

## Kết luận vận hành

- Muốn **xóa/gom ngay hôm nay** → dùng OpenClaw Desktop trên máy + prompt `05-...`.  
- Muốn **em (Cursor) điều khiển trực tiếp** → mở Cursor Desktop local + MCP `openclaw mcp serve`, hoặc đưa Cloud vào cùng mạng/token với Gateway.
