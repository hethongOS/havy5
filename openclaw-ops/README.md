# OpenClaw ops — dọn rác / chuẩn hóa vận hành

Thư mục này chuẩn hóa việc dọn `O:\OPENCLAW` mà **không phá runtime**.

| File | Mục đích |
|---|---|
| [cleanup/01-VERDICT.md](cleanup/01-VERDICT.md) | Thẩm định báo cáo kiểm kê: cái gì đáng xóa |
| [cleanup/02-STANDARD.md](cleanup/02-STANDARD.md) | Chuẩn nhãn + skill junk + dữ liệu tạo ẩu |
| [cleanup/03-LOCAL-AGENT-DIRECTIVE.md](cleanup/03-LOCAL-AGENT-DIRECTIVE.md) | Prompt dán cho agent local để điều khiển dọn |
| [scripts/preflight-audit.ps1](scripts/preflight-audit.ps1) | Audit chỉ-đọc trên máy Windows |
| [scripts/phase1-quarantine.ps1](scripts/phase1-quarantine.ps1) | Quarantine đợt 1 (cache/installer) |

## Giới hạn

Cloud agent **không** truy cập ổ O. Việc xóa/quarantine phải chạy trên máy host qua agent local + script PowerShell.
