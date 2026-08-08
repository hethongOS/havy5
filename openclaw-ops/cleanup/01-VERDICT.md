# Verdict kiểm kê O:\OPENCLAW

Nguồn: báo cáo chỉ-đọc của agent local. Cloud agent **không** truy cập được ổ O; verdict này thẩm định logic, không tự xóa.

## Kết luận ngắn

Phân loại gốc **đúng hướng và đủ thận trọng**. Đợt 1 chỉ nên dọn **cache / bộ cài VS Code cũ / diagnostics tạm** (~4–6 GB). Không xóa `state` backup hàng loạt hay kho model trước khi xác minh. Thiếu hạng mục quan trọng anh muốn: **skill rỗng/lỗi** và **dữ liệu tạo ẩu**.

| Hạng mục | Đáng xóa? | Ghi chú |
|---|---|---|
| `state`, `workspace` đang chạy, `apps`, `node-global`, `secrets`, `havy-memory`, `van-phong-so` | **KHÔNG** | Runtime thật |
| `havy-router-v2-backup-20260719` | **KHÔNG** | Tên backup nhưng đang bị Node giữ |
| `cache\npm`, `.cache` | **CÓ** (sau khi dừng) | Tái tạo được |
| `vscode-stable-user-x64-*` cũ (~12 bộ) | **CÓ** (sau khi installer đóng) | ~2,2 GB; giữ bộ đang dùng |
| `tmp` đang bị process giữ | **KHÔNG** | Giữ đến khi process thoát |
| `sandbox`, `lab`, `_edge-eye-test` | **CÓ THỂ** sau xác minh | Quarantine trước, không hard-delete |
| `workspace\tmp\*` pilot | **CÓ THỂ** nếu hết thí nghiệm | Quarantine |
| 4–5 bản `state*` backup (~13 GB) | **CÓ THỂ** giữ 1, bỏ 4 | Rủi ro cao — quarantine ≥7 ngày |
| `OPENCLAW\models` vs `OLLAMA_MODELS` | **CHƯA** | Xác minh env/process trước |
| `workspace_so_1/2/3` | **CHƯA** | Có thể là workspace agent riêng |

## Điểm đồng ý với báo cáo gốc

1. Không dọn khi OpenClaw đang chạy.
2. Ưu tiên giữ đường dẫn; không “sắp xếp” bằng cách di chuyển runtime.
3. VS Code installer cũ trong `tmp` là rác khả năng cao.
4. Nhiều bản `state*` gần nhau là ứng viên lớn nhất nhưng rủi ro nhất.
5. Hai kho model chưa đủ bằng chứng để xóa.

## Điểm cần siết lại

1. **`workspace_so_*` không phải rác chỉ vì cùng dung lượng.** OpenClaw multi-agent thường có `workspace-<agentId>`. Phải đối chiếu `openclaw.json` → `agents.entries.*.workspace`.
2. **`sandbox` / `lab` không tự động = rác.** Chỉ dọn nếu không còn tham chiếu config và không có tiến trình mở file.
3. **Thiếu audit skill + nội dung ảo.** Đây mới là “rác không thực chất” anh nói: skill stub, memory dump, file agent tự sinh hàng loạt.
4. **Không soft-move runtime.** Chỉ quarantine sang `O:\OPENCLAW\_quarantine\YYYYMMDD\` rồi xóa sau thời gian chờ.

## Thứ tự an toàn

```text
A. Dừng OpenClaw (gateway, 9Router, Ollama, MCP, web, agent)
B. Đợt 1 — an toàn: npm cache, .cache, vscode installer cũ, diagnostics cũ
C. Đợt 2 — quarantine: sandbox/lab/test/tmp pilot đã xác minh chết
D. Đợt 3 — giữ 1 state backup tốt nhất; quarantine 4 bản còn lại
E. Đợt 4 — xác minh Ollama path; chỉ rồi mới đụng kho model trùng
F. Song song — audit skill rỗng + dữ liệu tạo ẩu (không phụ thuộc dung lượng lớn)
```
