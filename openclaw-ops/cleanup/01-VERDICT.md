# Verdict kiểm kê O:\OPENCLAW

Nguồn: báo cáo chỉ-đọc của agent local. Cloud agent **không** truy cập được ổ O; verdict này thẩm định logic, không tự xóa.

## Kết luận ngắn

Phân loại gốc **đúng hướng về an toàn**, nhưng **chưa đủ mạnh** so với mục tiêu thật của anh: gom về **1 mô hình văn phòng số chuẩn**, cắt nhánh `so_1/2/3` và thí nghiệm mở rộng quá nhanh.

Đợt lấy GB nhanh: **cache / VS Code installer** (~4–6 GB).  
Đợt thống nhất mô hình: **so_*/lab/sandbox/tmp/state-backup thừa + skill stub** (nhiều GB hơn, cần OpenClaw tự đánh giá rồi duyệt).

Chi tiết tư duy CANON: [04-CANONICAL-OFFICE.md](04-CANONICAL-OFFICE.md).

| Hạng mục | Đáng xóa? | Ghi chú |
|---|---|---|
| `state`, `workspace` chính, `apps`, `node-global`, `secrets`, `havy-memory`, `van-phong-so` | **KHÔNG** | CANON / runtime |
| `havy-router-v2-backup-20260719` | **KHÔNG** lúc đang chạy | Tên backup nhưng Node đang giữ |
| `cache\npm`, `.cache` | **CÓ** | Tái tạo được |
| `vscode-stable-user-x64-*` cũ (~12 bộ) | **CÓ** | ~2,2 GB |
| `tmp` đang bị process giữ | **KHÔNG** | Đợi process thoát |
| `sandbox`, `lab`, `_edge-eye-test`, `workspace\tmp\*` | **CÓ (quarantine)** | Ngoài CANON — thí nghiệm |
| 4–5 bản `state*` backup (~13 GB) | **CÓ (giữ 1)** | Quarantine ≥7 ngày |
| `OPENCLAW\models` vs `OLLAMA_MODELS` | **VERIFY → giữ 1** | Xác minh process |
| `workspace_so_1/2/3` | **CÓ nếu rỗng thực chất** | Đúng hướng anh nói; xác nhận bằng `agents list` + nội dung rồi `agents delete` |

## Điểm đồng ý với báo cáo gốc

1. Không dọn khi OpenClaw đang chạy.
2. Ưu tiên giữ đường dẫn; không “sắp xếp” bằng cách di chuyển runtime.
3. VS Code installer cũ trong `tmp` là rác khả năng cao.
4. Nhiều bản `state*` gần nhau là ứng viên lớn nhất nhưng rủi ro nhất.
5. Hai kho model chưa đủ bằng chứng để xóa.

## Điểm cần siết lại (theo tư duy thống nhất)

1. **`workspace_so_*` mặc định là ứng viên cắt** nếu chỉ có tên/không hoạt động — đúng với mục tiêu 1 office chuẩn. Vẫn phải chứng minh bằng `openclaw agents list` + nội dung workspace trước khi delete.
2. **`sandbox` / `lab` / pilot = ngoài CANON** → quarantine, không giữ “phòng khi cần” lâu dài.
3. **Skill + dữ liệu tạo ẩu** phải nằm trong đợt cắt, không chỉ cache.
4. **Quarantine/Trash trước, hard-delete sau ≥7 ngày.** Dùng `openclaw agents delete --force` (đưa Trash) khi là agent.

## Thứ tự thống nhất

```text
P0. Chốt CANON (1 office + 1 workspace + 1 model store)
P1. Cache/installer — lấy GB nhanh
P2. OpenClaw tự đánh giá agents/skills → delete agent rỗng (so_*)
P3. Quarantine lab/sandbox/tmp/state-backup thừa
P4. Disable/quarantine skill stub
P5. Sau ≥7 ngày: hard-delete quarantine
```

Prompt điều khiển OpenClaw tự đánh giá: [05-OPENCLAW-SELF-EVAL-DIRECTIVE.md](05-OPENCLAW-SELF-EVAL-DIRECTIVE.md).
