# Prompt điều khiển OpenClaw — gom về 1 văn phòng số chuẩn

Dán cho **agent local trên máy Windows** (Cursor Desktop hoặc session OpenClaw có quyền shell). Không chạy từ cloud.

---

```text
NHIỆM VỤ: Thống nhất OpenClaw về ĐÚNG 1 mô hình văn phòng số chuẩn.
Tư duy: so_1/so_2/so_3 và nhiều nhánh thí nghiệm trước đây CÓ TÊN NHƯNG KHÔNG THỰC CHẤT / mở rộng quá nhanh theo nhiều mô hình → cắt.
Không sáng tạo mô hình mới. Chỉ đánh giá, phân loại, quarantine theo duyệt.

ROOT=O:\OPENCLAW
QUARANTINE=O:\OPENCLAW\_quarantine\consolidate-20260808
CANON_DOC=openclaw-ops/cleanup/04-CANONICAL-OFFICE.md

## CANON tạm thời (chờ tôi xác nhận nếu sai)
KEEP_LIVE:
- O:\OPENCLAW\state
- O:\OPENCLAW\workspace (workspace chính đang trỏ trong openclaw.json)
- O:\OPENCLAW\apps
- O:\OPENCLAW\node-global
- O:\OPENCLAW\secrets
- O:\OPENCLAW\havy-memory
- O:\OPENCLAW\van-phong-so
- đúng 1 kho model mà process Ollama đang dùng
- 1 state backup tốt nhất (gắn KEEP_BACKUP)

NGOÀI CANON (mặc định cắt sau duyệt):
- workspace_so_1, workspace_so_2, workspace_so_3
- sandbox, lab, _edge-eye-test, workspace\tmp\*
- state.bak*, _backup_*, state-backup-*, state_bi_loi* (trừ KEEP_BACKUP)
- cache\npm, .cache, vscode-stable-user-x64-* cũ
- skill stub/lỗi/không dùng

## Luật
1. Phase đánh giá = chỉ đọc + báo cáo. Không xóa.
2. Chỉ khi tôi gõ đúng token mới ghi đĩa:
   - APPROVE_CANON <path...>   (chốt KEEP)
   - APPROVE_PHASE_1           (cache/installer)
   - APPROVE_AGENTS_DELETE     (openclaw agents delete --force)
   - APPROVE_QUARANTINE_EXTRA  (lab/so_*/backup thừa)
   - APPROVE_JUNK_SKILLS       (disable + quarantine skill stub)
3. Ưu tiên: openclaw agents delete (đưa Trash) > Move-Item sang QUARANTINE > hard-delete (cấm đợt này).
4. Không đụng path đang bị process mở.
5. Mỗi action ghi manifest JSON trong QUARANTINE.

## Bước 1 — Tự đánh giá (làm ngay)
Chạy và tổng hợp bảng:
A) openclaw agents list --json
B) openclaw agents list --bindings
C) openclaw skills check
D) openclaw doctor --non-interactive
E) env: OLLAMA_MODELS, OPENCLAW_STATE_DIR, OPENCLAW_WORKSPACE_DIR
F) size GB các path ngoài CANON
G) với mỗi agent/workspace_so_*: chứng cứ “không thực chất”
   - thiếu AGENTS.md/SOUL.md/MEMORY có nội dung
   - không binding kênh
   - không session/activity gần đây
   - skill rỗng hoặc trùng

Xuất file: QUARANTINE\report-self-eval.md
Cột: id/path | size_gb | substance(yes/no/weak) | evidence | proposed_action

## Bước 2 — Đề xuất cắt
Nhóm:
1. DELETE_AGENT (qua CLI)
2. QUARANTINE_DIR
3. DISABLE_SKILL
4. KEEP
Không tự làm. Chờ token duyệt.

## Bước 3 — Thực thi theo token
Khi nhận APPROVE_*:
- làm đúng nhóm được duyệt
- báo GB lấy lại
- liệt kê rủi ro còn lại

Bắt đầu Bước 1 ngay. Tiếng Việt, ngắn, bảng rõ.
```

---

## Anh trả lời OpenClaw thế nào

1. Đọc `report-self-eval.md`.
2. Nếu CANON đúng: `APPROVE_CANON` (hoặc sửa path rồi duyệt).
3. Lấy GB nhanh: `APPROVE_PHASE_1`.
4. Cắt so_1/2/3 nếu báo cáo xác nhận rỗng: `APPROVE_AGENTS_DELETE`.
5. Cắt lab/backup thừa: `APPROVE_QUARANTINE_EXTRA`.
6. Skill rác: `APPROVE_JUNK_SKILLS`.
