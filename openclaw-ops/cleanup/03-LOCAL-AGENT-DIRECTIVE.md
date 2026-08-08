# Lệnh điều khiển agent local — dọn OpenClaw

Copy nguyên khối dưới đây cho agent **đang chạy trên máy Windows có ổ O** (Cursor Desktop / GPT local). Cloud agent không thực thi được các lệnh này.

---

## PROMPT GỬI AGENT LOCAL

```text
Bạn là kỹ sư vận hành OpenClaw trên máy này. Làm đúng playbook, không sáng tạo ngoài phạm vi.

ROOT = O:\OPENCLAW
QUARANTINE = O:\OPENCLAW\_quarantine\20260808
STANDARD = repo havy5 / openclaw-ops/cleanup/02-STANDARD.md
VERDICT = repo havy5 / openclaw-ops/cleanup/01-VERDICT.md

## Luật bắt buộc
1. Chế độ mặc định: CHỈ ĐỌC + lập danh sách.
2. Chỉ quarantine/xóa khi tôi gõ đúng: APPROVE_PHASE_1 / APPROVE_PHASE_2 / APPROVE_PHASE_3.
3. Không đụng KEEP_LIVE. Không rename runtime.
4. Trước mọi thao tác ghi: xác nhận OpenClaw đã dừng (gateway, 9Router, Ollama, MCP Bridge, web, agent Node).
5. Mọi thứ nghi ngờ → move vào QUARANTINE, ghi manifest JSON, không hard-delete.

## Phase 0 — Preflight (chỉ đọc)
Chạy và báo cáo:
- Dung lượng ROOT, free space ổ O
- Process còn giữ file dưới ROOT (đặc biệt tmp\vscode-*, havy-router*, ollama)
- Đọc openclaw.json / env: OPENCLAW_STATE_DIR, OPENCLAW_WORKSPACE_DIR, OLLAMA_MODELS
- Liệt kê agents.entries.*.workspace
- So sánh O:\OPENCLAW\models vs O:\OLLAMA_MODELS (số model, kích thước, path đang dùng)

## Phase 1 — SAFE_REBUILD (chỉ sau APPROVE_PHASE_1)
Ứng viên xóa/quarantine:
- cache\npm
- .cache
- tmp\vscode-stable-user-x64-* TRỪ bộ đang bị process dùng
- diagnostics/tmp rõ ràng chết
Ghi file: QUARANTINE\manifest-phase1.json (path, size, reason, sha256 nếu tiện)
Báo GB lấy lại thực tế.

## Phase 2 — Thí nghiệm chết (APPROVE_PHASE_2)
Chỉ quarantine nếu không còn process + không còn reference config:
- sandbox, lab, _edge-eye-test
- workspace\tmp\vip-abc-pilot, desktop-control, chat-import-*
Không đụng workspace_so_* ở phase này.

## Phase 3 — State backup (APPROVE_PHASE_3)
1. Xác nhận state hiện tại healthy.
2. Chọn 1 backup tốt nhất → gắn nhãn KEEP_BACKUP (không move).
3. Quarantine các bản còn lại:
   - state.bak-before-agent-so-1-creation
   - _backup_unknown_parent_*
   - _backup_reset_session_*
   - state-backup-pairing
   - state_bi_loi_*
   (trừ bản KEEP_BACKUP)

## Phase 4 — Models (chỉ đề xuất, chưa xóa)
Chứng minh kho nào Ollama/OpenClaw đang dùng. Đề xuất 1 kho KEEP, 1 kho VERIFY/QUARANTINE. Không xóa cho đến lệnh APPROVE_MODELS riêng.

## Phase S — Skill + dữ liệu ảo (chỉ đọc trước)
Quét skill dirs; gắn JUNK_SKILL theo chuẩn:
- thiếu SKILL.md thực
- stub/TODO/<20 dòng hữu ích
- frontmatter/path lỗi, symlink gãy
- bản copy trùng không khác biệt
- không trong allowlist và không được dùng

Quét JUNK_DATA:
- file sinh hàng loạt ngắn hạn
- pilot/scratch/test không consumer
- dump phiên thử

Xuất: QUARANTINE\report-junk-skills-data.md
Chờ APPROVE_JUNK mới quarantine.

## Đầu ra mỗi phase
1. Bảng: path | size_gb | label | evidence | action
2. Tổng GB dự kiến
3. Rủi ro còn lại
4. Câu hỏi chốt (nếu thiếu evidence)

Bắt đầu Phase 0 ngay. Không ghi đĩa ngoài việc tạo report trong workspace chat.
```

---

## Cách anh dùng

1. Dán prompt trên cho agent local khi OpenClaw còn chạy → chỉ nhận Phase 0.
2. Đọc bảng → gõ `APPROVE_PHASE_1` nếu đồng ý đợt an toàn.
3. Lặp với phase 2/3 và `APPROVE_JUNK` khi muốn bỏ skill/data ảo.
4. Không bao giờ approve phase 3/models khi chưa có smoke restore / chứng minh path.
