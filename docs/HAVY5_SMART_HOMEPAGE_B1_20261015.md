# HAVY5 — SMART WEBSITE BƯỚC 1 V2 (Vòng 1) — KCS LAB 15/10/2026

**WORK_ID:** HAVY5-SMART-HOME-B1-20261015-001
**SOURCE:** `hethongOS/havy5`, bản gốc LAB V5 + A8/B/C tại commit `722bd40`.
**BRANCH:** `lab/havy5-smart-website-v2-20261015`.
**WORKSPACE:** `D:\LAB\HAVY5-SMART-WEB-V2-ANTIGRAVITY`.
**NỀN TẢNG THI CÔNG:** Google Antigravity (phối hợp ChatGPT KCS qua máy Dell), KHÔNG Lovable, KHÔNG Cursor.
**TRẠNG THÁI:** VÒNG 1 — GIAO DIỆN LAB CHẠY ĐƯỢC, KCS KỸ THUẬT CƠ BẢN PASS; CHỜ FOUNDER XEM GIAO DIỆN & PROMPT CHUYÊN SÂU VÒNG 2.
**FOUNDER GATE:** CHƯA XUẤT BẢN / CHƯA ĐƯỢC PHÊ DUYỆT DÙNG PRODUCTION.

## 1. Đầu vào có nguồn
- `TEACHER_SMART_WEBSITE_B1_V2_ORIGINAL.txt`: prompt thầy “SMART WEBSITE — BƯỚC 1 V2”, lưu nguyên bản, không sửa nội dung gốc.
- `HAVY5_SMART_HOME_TASK_20261015.md`: ràng buộc kiến trúc Hà Vy, giữ cấu trúc trang đang có.
- `data/bcm_havy5_snapshot_readonly.json`: bản chụp BCM PRO V2 chỉ để đối chiếu chiến lược, KHÔNG coi mọi trường là Founder đã duyệt.
- `src/website-context.mjs`: lớp chọn lọc chiến lược/persona/CTA/mô tả công khai; không lưu thông tin tài chính nội bộ hay mật khẩu.
- `public/catalog-assets/*.webp`: ảnh tư liệu vật liệu thực tế khôi phục từ A8/B/C; việc ảnh có chính xác theo biến thể SKU cần Founder xác minh.

## 2. Ba hướng Hero đã cân nhắc
| Phương án | Ưu điểm | Khuyết điểm / quyết định |
|---|---|---|
| **A — Ảnh kho toàn cảnh** | Bằng chứng vị trí hàng thật, tạo sự tin cậy | Chưa có ảnh kho đã kiểm định quyền và ngữ cảnh cho Hero; KHÔNG dựng giả |
| **B — Bộ chọn nhu cầu trong Hero** | Tạo tương tác nhanh cho chủ nhà mới | Quá nhiều lựa chọn trước khi biết câu hỏi; trùng bộ tư vấn 4 câu của web |
| **C — Mosaic sản phẩm tư liệu + hai CTA** | Có ảnh thực thay đồ họa mô phỏng; hỗ trợ cả CD-NAM & CD-LAN; dễ mở rộng | Cần gắn nhãn ảnh tư liệu, chưa coi từng ảnh là bằng chứng mã SKU; **ĐÃ CHỌN TRIỂN KHAI** |

**Hero triển khai:** headline “Chọn đúng ván cho đúng việc”; CTA “Tôi chưa biết chọn ván” → `/chon-vat-lieu/`, CTA “Tôi đã có quy cách — kiểm giá” → `/bao-gia/?muc-dich=kiem-gia`. Mosaic ảnh từ `mdf012-1.webp`, `cph003-1.webp`, `cmb006-1.webp`; ảnh vật liệu minh họa / lưu trữ, không ngụ ý giá/tồn kho hay xuất xứ/chứng nhận đã xác minh.

## 3. Cải tiến trang chủ theo BCM
- **14 section:** giữ 14 section theo cấu trúc V5 (đếm bằng ID `homepageSections`), không xóa đường dẫn cũ hoặc hệ thống danh mục, báo giá.
- **Persona:** CD-LAN = chủ nhà sửa nhà, đường tư vấn 4 câu; CD-NAM = thầu/xưởng nội thất, đường kiểm giá quy cách. Thể hiện ở thẻ lựa chọn nhu cầu.
- **Ảnh hạng mục:** dùng ảnh tư liệu có tệp gốc rõ nguồn thay thẻ trống; một số thẻ sử dụng ảnh dòng vật liệu chứ chưa phải ảnh đúng hạng mục thi công thực tế.
- **Danh mục:** đưa các nhóm vật liệu theo nhu cầu, liên kết danh mục sản phẩm chi tiết; 18 gia đình sản phẩm, 188 SKU là snapshot LỊCH SỬ, không phải tuyên bố còn hàng.
- **Bằng chứng:** giữ 3 địa điểm Quy Nhơn và ghi rõ hình ảnh kho chưa xác minh nếu thiếu; tránh các số liệu khách hàng, chứng nhận, hình before/after hoặc lời đánh giá bịa.
- **Thông điệp:** không bán sai công năng; cần kiểm tra hệ kết cấu và datasheet đối với các tính năng kỹ thuật, không hứa tự động tư vấn chịu lực.

## 4. KCS thực tế
- `npm run lint`: PASS.
- `npm test`: **33/33 PASS** (27 bài cũ + 6 bài BCM/Hero/ảnh/CTA mới).
- `npm run build`: PASS, **217 static pages**.
- KCS trình duyệt Chromium trên máy Dell: **28/28 HTTP 200** (7 route × 390/768/1365/1440px), **28/28 không tràn ngang**, không có ảnh vỡ ghi nhận, không có lỗi page JS. Menu mobile, tìm Cemboard trong danh mục và biểu mẫu hỏi giá được kiểm thử smoke.
- Hồ sơ máy: `docs/HAVY5_B1_BROWSER_KCS_20261015.json`.
- Screenshot thật: `docs/screenshots/havy5-smart-home-{390,768,1365,1440}.png`, bản full tại `docs/screenshots/havy5-smart-home-full-{390,1440}.jpg`.
- Địa chỉ preview trên máy Dell: **http://localhost:4186/** (không phải public).
- **Chưa có:** đo Lighthouse trên hosting thật, tự động kiểm WCAG hoàn chỉnh, hiệu quả chuyển đổi kinh doanh, xác minh thông số kỹ thuật từng SKU, CRM end-to-end. Không được gọi production-ready.

## 5. Kiểm soát nguồn, an toàn và dữ liệu còn thiếu
- Không dùng hình giả tạo thay ảnh kho thật, không tự viết testimonials; alt ảnh ưu tiên “ảnh tư liệu” khi thiếu bằng chứng đối chiếu SKU.
- Các claim như chịu lực, chịu nước, chống cháy cần datasheet/điều kiện ứng dụng và KCS; UI phải có ngôn ngữ thận trọng.
- Cần rà soát 18 dòng/188 SKU lịch sử với danh mục 159 mã trên havyqn.com hiện nay.
- Hai nhóm ảnh gỗ ghép thông và cao su trong kho tư liệu chưa có ảnh đã đối chiếu.
- BCM trong LAB chưa phải chiến lược được Founder phê duyệt để công bố toàn diện. Tệp snapshot nội bộ không được lộ secrets; static build hiện chỉ đưa những gì frontend yêu cầu.
- Không thay `havyqn.com`, `main`, Git integration Lovable, hoặc dữ liệu bán hàng/công nợ.

## 6. Quy trình sau vòng 1
1. **KCS hiện tại:** kiểm định nội dung, ảnh, CTA, UX mobile; bảo toàn source tại LAB.
2. **Founder:** mở `http://localhost:4186/` trên Dell, xem Hero và trang chủ; chỉ cần phản hồi điều anh thích/chưa thích, có thể gửi **prompt chuyên sâu vòng 2** đã hẹn.
3. **Antigravity:** thực hiện vòng 2 trên bản kế thừa này, không thiết kế lại từ đầu, rồi lặp lint/test/build/browser KCS.
4. **Lovable:** chỉ cân nhắc kết nối làm nơi phản biện cuối sau vòng 2 và Founder Gate; không tự ép vào repo `ha157-sudo/havy5` hoặc `hethongOS/havys-wood-guide`.

## Bàn giao
**OWNER:** Antigravity (thi công LAB), ChatGPT/GIANG (KCS), Founder (Gate).
**DONE_SO_FAR:** Có giao diện thực chạy trên 4 viewport, đủ 217 đường dẫn, 33 test PASS, ảnh kiểm chứng thật, không sửa production.
**NEXT_ACTION:** Founder xem preview và gửi prompt chuyên sâu V2; nếu thấy lỗi KCS thì sửa trên LAB trước.
**ACCEPTANCE:** Vòng 1 chấp nhận ở mức preview LAB; chưa chấp nhận nghiệm thu website kinh doanh.
**EVIDENCE:** log test/lint/build, JSON Chromium, screenshot tại docs/screenshots.

**Bao mat:** Snapshot BCM V2 nam ngoai thu muc public/ de khong bi phat hanh nhu tai nguyen cong khai khi chuyen sang Vite/Lovable.

**Phan loai tai lieu:** Prompt thầy và snapshot BCM gốc lưu trên máy Dell, đặt trong .gitignore, không xuất bản lên repository GitHub công khai. Report, mã trang chủ và ảnh screenshot kiểm thử có thể lưu trên GitHub.

**Minh chung hinh:** Anh full-page PNG do goc duoc giu tren may Dell; GitHub cong khai chi luu ban JPG nen de tai/kiem dinh nhanh, khong lam thay doi giao dien.
