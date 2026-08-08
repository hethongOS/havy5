# Chuẩn dọn OpenClaw (tinh gọn, ưu tiên thực chất)

Áp dụng cho `O:\OPENCLAW` (ổ vận hành). Mục tiêu: bỏ **rác không thực chất**, không phá đường dẫn runtime.

## Nguyên tắc cứng

1. **Runtime > dung lượng.** Không xóa thứ đang bị process mở.
2. **Quarantine trước, xóa sau.** Mặc định chờ ≥7 ngày trong `_quarantine`.
3. **Một workspace active / agent.** Thư mục thừa chỉ archive sau khi config không còn trỏ tới.
4. **Không đổi tên / move** `state`, `workspace`, `apps`, `secrets`, `models` đang dùng.
5. **Skill phải có việc thật.** Skill stub, skill lỗi load, skill trùng tên vô nghĩa → loại.
6. **Dữ liệu tạo nhanh ≠ tài sản.** File agent tự sinh trong phiên thử, không được tham chiếu lại → loại.

## Nhãn quản trị

| Nhãn | Ý nghĩa | Hành động |
|---|---|---|
| `KEEP_LIVE` | Đang chạy / identity / secrets | Không đụng |
| `KEEP_BACKUP` | 1 bản phục hồi đã kiểm chứng | Giữ cố định |
| `SAFE_REBUILD` | Cache / installer / temp tái tạo được | Xóa sau khi dừng |
| `QUARANTINE` | Nghi rác nhưng chưa chắc | Move vào `_quarantine` |
| `VERIFY` | Cần đối chiếu config/process | Không xóa |
| `JUNK_SKILL` | Skill không thực / lỗi | Gỡ hoặc archive |
| `JUNK_DATA` | Nội dung tạo ẩu, vô dụng | Quarantine rồi xóa |

## Bản đồ KEEP_LIVE (không xóa)

- `O:\OPENCLAW\state`
- `O:\OPENCLAW\workspace` (và các project đang trỏ trong config)
- `O:\OPENCLAW\apps`
- `O:\OPENCLAW\node-global`
- `O:\OPENCLAW\secrets`
- `O:\OPENCLAW\havy-memory`
- `O:\OPENCLAW\van-phong-so`
- Mọi path đang có handle process (kể cả tên chứa `backup`)

## SAFE_REBUILD (đợt 1)

Chỉ khi **toàn bộ OpenClaw đã dừng**:

- `cache\npm`
- `.cache`
- `tmp\vscode-stable-user-x64-*` **trừ** bộ đang bị installer dùng
- diagnostics / log tạm rõ ràng không còn reference

Ước lượng: **4–6 GB**.

## VERIFY trước khi đụng

### Kho model

So khớp theo thứ tự:

1. Biến môi trường `OLLAMA_MODELS`
2. Cấu hình Ollama / OpenClaw (`openclaw.json`, service env)
3. Process Ollama đang đọc path nào (`Get-Process` + handle / command line)

Giữ đúng 1 kho đang dùng. Kho kia chỉ quarantine khi chứng minh không được đọc.

### `workspace_so_*` / workspace phụ

Đối chiếu:

```text
agents.defaults.workspace
agents.entries.*.workspace
OPENCLAW_WORKSPACE_DIR / OPENCLAW_STATE_DIR
```

Nếu không còn agent nào trỏ → `QUARANTINE`. Nếu còn trỏ → `KEEP_LIVE`.

### Bản sao `state*`

1. Xác nhận `state` hiện tại boot được.
2. Chọn **một** backup tốt nhất (mới nhất + restore smoke OK) → `KEEP_BACKUP`.
3. Các bản còn lại → `QUARANTINE` (≥7 ngày) rồi xóa.

Ước lượng thêm: **~10 GB** nếu 4 bản backup thừa.

## Skill — tiêu chí JUNK_SKILL

Quét mọi nơi skill có thể nằm:

- `workspace/**/skills`
- `O:\OPENCLAW\skills` (managed)
- per-agent skill dirs trong `state` / agent home

**Đánh dấu junk nếu thỏa ≥1 điều kiện mạnh:**

| Tiêu chí | Ví dụ |
|---|---|
| Thiếu `SKILL.md` / README thực thi | Thư mục rỗng hoặc chỉ tên |
| Nội dung stub | “TODO”, “placeholder”, < ~20 dòng hữu ích, không mô tả tool/step |
| Lỗi load | YAML/frontmatter hỏng, path tool chết, symlink gãy |
| Trùng tên vô nghĩa | Copy `skill-copy`, `skill-2`, không khác bản gốc |
| Không được allowlist / không được gọi ≥ N ngày và không thuộc baseline | Skill thí nghiệm bỏ quên |

**Không junk chỉ vì:** skill ngắn nhưng đang trong allowlist; skill docs chính thức Feishu/OpenClaw.

Hành động: move vào `_quarantine\skills\...` (không xóa cứng đợt đầu).

## Dữ liệu tạo ẩu — tiêu chí JUNK_DATA

| Tín hiệu | Ví dụ |
|---|---|
| Sinh hàng loạt trong thời gian ngắn | Hàng trăm file cùng phút, cùng prefix agent |
| Tên thí nghiệm | `vip-abc-pilot`, `edge-eye-test`, `tmp-*`, `scratch-*` |
| Không có consumer | Không import, không link từ AGENTS/MEMORY/config |
| Bản nháp agent | transcript dump trùng, “plan.md” rỗng, output thử model |
| Cache trình duyệt agent | `agent-browser-chrome-*` đã đóng process |

Giữ: `memory/YYYY-MM-DD.md` có nội dung thật, `MEMORY.md` curated, second-brain / DNA.

## Cấm

- Xóa khi gateway/Ollama/9Router/MCP/web/agent còn chạy
- Xóa cả hai kho model cùng lúc
- Xóa hết state backup cùng lúc
- “Dọn đẹp” bằng cách đổi cấu trúc thư mục runtime
- Commit secrets / sqlite state vào git workspace

## Mục tiêu dung lượng (thực tế)

| Đợt | Phạm vi | GB kỳ vọng | Rủi ro |
|---|---|---:|---|
| 1 | Cache + VS Code installer cũ | 4–6 | Thấp |
| 2 | lab/sandbox/test/tmp pilot | 3–5 | Trung bình |
| 3 | state backup thừa (giữ 1) | ~10 | Cao |
| 4 | model kho trùng (nếu chứng minh) | 9–19 | Cao |
| Skill/data ảo | Thường nhỏ về GB, lớn về nhiễu | thấp GB | Trung bình (hành vi agent) |
