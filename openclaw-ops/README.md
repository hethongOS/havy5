# OpenClaw ops — dọn rác / chuẩn hóa vận hành

Thư mục này chuẩn hóa việc dọn `O:\OPENCLAW` mà **không phá runtime**.

| File | Mục đích |
|---|---|
| [cleanup/01-VERDICT.md](cleanup/01-VERDICT.md) | Thẩm định kiểm kê: cái gì đáng xóa |
| [cleanup/02-STANDARD.md](cleanup/02-STANDARD.md) | Chuẩn nhãn + skill junk + dữ liệu tạo ẩu |
| [cleanup/03-LOCAL-AGENT-DIRECTIVE.md](cleanup/03-LOCAL-AGENT-DIRECTIVE.md) | Prompt dọn an toàn theo phase |
| [cleanup/04-CANONICAL-OFFICE.md](cleanup/04-CANONICAL-OFFICE.md) | Tư duy **1 văn phòng số chuẩn** — cắt so_*/lab |
| [cleanup/05-OPENCLAW-SELF-EVAL-DIRECTIVE.md](cleanup/05-OPENCLAW-SELF-EVAL-DIRECTIVE.md) | Prompt để OpenClaw tự đánh giá rồi xóa theo duyệt |
| [scripts/preflight-audit.ps1](scripts/preflight-audit.ps1) | Audit chỉ-đọc trên máy Windows |
| [scripts/phase1-quarantine.ps1](scripts/phase1-quarantine.ps1) | Quarantine đợt 1 (cache/installer) |

## Giới hạn

Cloud agent **không** truy cập ổ O và **không** gọi được gateway OpenClaw local.  
Cách làm: chốt chuẩn ở đây → anh dán prompt `05-...` cho OpenClaw/agent trên máy → nó tự list/đánh giá → anh duyệt token → nó cắt.
