# Tư duy thống nhất: 1 văn phòng số chuẩn

## Anh muốn gì (đã hiểu)

Không phải “dọn nhẹ cho đỡ đầy ổ”. Anh muốn:

1. **Một mô hình văn phòng số chuẩn** cho OpenClaw hiện nay.
2. Các nhánh `so_1 / so_2 / so_3` **có tên nhưng không thực chất** → loại.
3. Các thư mục/lab theo **nhiều mô hình khác nhau lúc trước** (mở rộng quá nhanh) → gom hoặc bỏ.
4. Skill cũng vậy: chỉ giữ skill **thực tế / đang dùng**; phần stub để OpenClaw tự đánh giá rồi cắt.
5. Mục tiêu vận hành: bớt phình ổ ~100GB, hệ thống mỏng, một nguồn sự thật.

## Nguyên tắc chốt

```text
1 CANONICAL OFFICE  >  nhiều thí nghiệm song song
KEEP = đang chạy thật + second-brain/DNA + secrets + 1 state
EVERYTHING ELSE named "office/agent/pilot/lab/so_*" = ứng viên cắt
Quarantine trước → xóa sau ≥7 ngày
OpenClaw tự đánh giá skill/agent; người duyệt danh sách rồi mới xoá hàng loạt
```

## Định nghĩa “mô hình chuẩn” (CANON)

Chọn **một** workspace làm chuẩn (đề xuất mặc định):

| Vai trò | Path đề xuất | Lý do |
|---|---|---|
| Runtime OpenClaw | `O:\OPENCLAW\state` + `apps` + `node-global` | Gateway thật |
| Văn phòng số chuẩn | `O:\OPENCLAW\van-phong-so` **hoặc** 1 workspace active trong config | Một UI/office |
| Trí nhớ/DNA | `O:\OPENCLAW\havy-memory` + `workspace\...\second-brain` nếu có | Knowledge thật |
| Secrets | `O:\OPENCLAW\secrets` | Không đụng |
| Models | **1** kho Ollama đang được process dùng | Tránh trùng |

Mọi thứ khác mang tính “mô hình song song / pilot / so_N / lab” → ngoài CANON.

## Ngoài CANON (cắt mạnh)

| Nhóm | Ví dụ | Hành động |
|---|---|---|
| Agent rỗng có tên | `workspace_so_1/2/3`, agent entries tương ứng | `openclaw agents delete <id> --force` nếu là agent; không thì quarantine folder |
| Thí nghiệm mở rộng nhanh | `sandbox`, `lab`, `_edge-eye-test`, `workspace\tmp\*` | Quarantine |
| State snapshot hàng loạt | mọi `state*backup*`, `state_bi_loi*`, `_backup_*` trừ 1 bản | Quarantine (giữ 1) |
| Skill stub / lỗi | thiếu SKILL.md, TODO, không load được | Disable hoặc quarantine theo `skills check` / doctor |
| Cache/installer | npm cache, vscode installer cũ | Xóa/quarantine đợt 1 |

## OpenClaw tự đánh giá được gì

Trên máy host (không từ cloud):

```powershell
openclaw agents list --json
openclaw agents list --bindings
openclaw skills check
openclaw doctor --non-interactive
# Khi đã duyệt agent rỗng:
openclaw agents delete <agent-id> --force --json
# Skill không dùng được:
openclaw doctor --fix --non-interactive
```

- `agents delete` đưa workspace/state/session vào **Trash** (không hard-delete) — đúng hướng quarantine.
- `doctor --fix` có thể **disable** skill thiếu bin/env (không xóa file skill).
- Việc xóa file skill/data vật lý vẫn cần script quarantine (phase riêng).

## Cloud điều khiển OpenClaw được không?

**Không trực tiếp.** Gateway nằm `127.0.0.1` trên máy anh. Cloud agent không gọi được.

Cách điều khiển thực tế:

1. Cloud/chốt chuẩn (repo này) → viết lệnh + tiêu chí CANON.
2. Anh dán **prompt điều khiển** cho agent local / chat OpenClaw trên máy.
3. OpenClaw/CLI tự list → anh duyệt `APPROVE_CONSOLIDATE` → nó `agents delete` + quarantine folder ngoài CANON.

## Thứ tự gom (aggressive nhưng có thắng)

```text
P0  Chốt CANON (1 office + 1 workspace + 1 model store) — anh xác nhận tên path
P1  Cache/installer (lấy GB nhanh, rủi ro thấp)
P2  OpenClaw tự list agents/skills → xóa agent rỗng so_* / pilot
P3  Quarantine lab/sandbox/tmp/state-backup thừa
P4  Skill junk (disable qua doctor + quarantine thư mục stub)
P5  Sau ≥7 ngày: hard-delete quarantine nếu ổn
```

Không “xóa tất cả rồi dựng lại từ zero” trừ khi anh cố ý reset. Cách an toàn hơn: **giữ CANON, cắt mọi nhánh song song**.
