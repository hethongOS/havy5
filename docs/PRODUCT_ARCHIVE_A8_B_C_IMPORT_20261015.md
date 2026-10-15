# HAVY5 — Tích hợp kho sản phẩm A8/B/C, LAB 15/10/2026

**Trạng thái:** ĐÃ DỰNG & KIỂM THỬ TRONG LAB. CHƯA PUBLISH. KHÔNG THAY ĐỔI havyqn.com / MAIN.

## Mục tiêu và nguồn
- **Giao diện:** dựa tinh thần phiên A8 (mã giao diện A ngày 19/06 + dữ liệu cũ tháng 8) với thẻ hình, bộ lọc, trang sản phẩm mẹ, bảng biến thể; không sao chép toàn bộ React/Supabase đời cũ.
- **Dữ liệu:** bản chụp chỉ đọc phục hồi bởi Cursor trong D:\LAB\havy-old-ui; 18 sản phẩm mẹ, 188 biến thể lưu trữ. Thực tế dữ liệu nguồn ở hệ thống cũ phần lớn có timestamp tháng 5–6/2026. Không được coi là tình trạng tại 24/08 hoặc 15/10.
- **Cách tư vấn:** giữ nguyên trục của HAVY5 / phiên C: hạng mục → điều kiện sử dụng → công năng → quy cách → liên hệ.
- **Website hiện tại:** havyqn.com đang có 159 mã hàng, chưa được đồng nhất với 188 biến thể lưu trữ. Không nhập giá hay trạng thái tồn kho cũ.
- **Ảnh:** ảnh gốc lấy từ bản chụp storage public, được xử lý cục bộ thành tệp WebP tĩnh; không lấy trực tiếp từ localhost Cursor, không đọc secret. Có 53 tệp WebP ~2,5 MB. Tương ứng 16/18 dòng sản phẩm có ảnh; thiếu GGT002-THÔNG và GGT003-CAO SU, hiển thị chỗ giữ ảnh trung thực. Mỗi dòng tối đa 4 ảnh; chưa nhập toàn bộ 282 ảnh đã kiểm tra của Cursor.

## Kết quả kỹ thuật
- Giữ trang chủ 14 section, bộ tư vấn 4 câu, trang công năng 3 vật liệu và Zalo handoff đang có.
- Thêm /san-pham/ với tìm theo tên / SKU, lọc theo nhóm, ảnh, số biến thể, CTA chuyển trang chi tiết.
- Thêm 18 trang /san-pham/{slug}/: nhiều hình, lưu ý, danh sách đầy đủ mã hàng, thương hiệu / độ dày / kích thước nguồn cũ.
- Thêm 188 trang /ma-hang/{sku}/: hồ sơ SKU, nút sao chép, truyền mã SKU được lọc an toàn vào yêu cầu kiểm giá, không công bố giá/tồn kho.
- Menu "Sản phẩm" dẫn tới danh mục mới, trang chủ có liên kết danh mục đầy đủ.
- Thêm CSS catalog và JS bộ lọc/gallery; trang HTML build 217 trang.
- Ảnh đã được tải về tệp tĩnh; tính năng web không phụ thuộc server localhost Cursor khi publish preview từ GitHub.
- Quy trình nhập lại nguồn: scripts/import-legacy-catalog.py (yêu cầu Python Pillow và bản snapshot được Founder cấp phép) → src/catalog-data.json và public/catalog-assets. Không đưa snapshot gốc, .env, credentials, thông tin khách hàng, cost_price, stock_qty, giá cũ vào mã nguồn website.

## Kiểm soát dữ liệu
- Mã hàng 188 là **dữ liệu lưu trữ**, không được quảng cáo như 188 mặt hàng đang có kho.
- Ảnh khôi phục đã có nguồn file và hash rút gọn trong JSON, **chưa có KCS của Founder về ảnh khớp chính xác mỗi mã/nhà sản xuất**.
- Hai nguồn 188 mã cũ và 159 mã site hiện tại vẫn cần đối chiếu, đặc biệt mã nhập trùng và tên gọi khác nhau. Tạm thời không đồng bộ tự động.
- Không đưa lời cam kết "30 năm không đổi", "3.000+ công trình" hay địa chỉ 52 Tăng Bạt Hổ từ bản A/B vào HAVY5.
- Không tự đưa ra kết luận chịu lực, chịu nước hay công bố tiêu chuẩn kỹ thuật không có datasheet. Giá, tồn kho: luôn yêu cầu xác minh khi liên hệ.
- LAB luôn noindex. Không ghi CRM, DB Supabase production, không đổi DNS/website đang hoạt động.

## Kiểm thử
- npm run lint: cần PASS tại nhánh thực thi.
- npm test: 27/27 PASS, gồm 4 test mới về danh mục, đường dẫn, ảnh và dữ liệu cấm.
- npm run build: tạo 217 trang; sửa build để portable Windows/Linux.
- Browser QA: PASS trên Chromium ở 390px/1365px cho danh mục, Cemboard và mã CMB006-2: 6/6 trang HTTP 200, không tràn ngang, 16/16 ảnh xuất hiện và tải ở desktop; 5/16 ảnh mobile được tải ngay do lazy-loading, hình chi tiết 4/4; bộ tìm Cemboard thu còn 1 dòng. Metadata và noindex hợp lệ. Có ảnh minh chứng trong docs/screenshots. Đây là smoke UI LAB, chưa thay thế kiểm định tải thực trên hosting, WCAG hoặc Lighthouse.
- KCS trước xuất bản: đối chiếu hình với hàng thực tế; thống nhất bảng ánh xạ 159 SKU hiện hành; chốt dữ liệu công năng có datasheet; xác nhận hotline/giờ làm; đo Lighthouse, WCAG, SEO và conversion funnel.

## OWNER / NEXT ACTION / FOUNDER GATE
- DUY: giữ module catalog trong LAB, thiết kế bảng đối chiếu 159 ↔ 188, xử lý ảnh thiếu.
- BÁCH: phân loại ảnh gốc, ghi nguồn và độ tin cậy.
- GIANG: độc lập soát URL, test, ảnh và KCS trên preview.
- Founder: xem trang sản phẩm, chọn phong cách; duyệt các thay đổi production, chi phí hoặc công bố mới.

**Kết luận:** Hoàn tất bước tích hợp kỹ thuật module danh mục trên LAB, không tuyên bố đã chuẩn hóa dữ liệu giá/tồn kho hoặc đã ra production.
