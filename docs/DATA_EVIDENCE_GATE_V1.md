# HAVY5 — CỔNG BẰNG CHỨNG SẢN PHẨM V1 / 2026-10-14

WORK_ID: WEBFACTORY-HAVY-001. P01 + P04 + P07. Trạng thái: evidence policy READY, SKU details NOT VERIFIED.

## Nguồn vận hành
Notion: https://app.notion.com/p/3e28cf20915581498911f0c2112bac6b?pvs=204 — "00_CHUAN_KHO_TRI_THUC_SAN_PHAM", bản nội bộ 2026-09-06, nguồn quy định kiểm soát claim. Việc trang Notion có nội dung quy trình không chứng minh thông số sản phẩm.

Bốn lớp theo hồ sơ nội bộ:
- XAC_NHAN_NOI_BO: triết lý bán hàng/quy trình được Founder xác nhận, mô tả định tính đúng phạm vi.
- XAC_MINH_KY_THUAT: chỉ được ghi thông số khi có datasheet hãng/tiêu chuẩn, nguồn + ngày + phạm vi.
- DU_LIEU_SONG: giá/tồn kho/giao hàng chỉ lấy dữ liệu vận hành có timestamp còn hiệu lực; không lấy file lịch sử.
- UNG_VIEN: blog cũ, nội dung AI, dữ liệu seed/di sản, đối thủ, tất cả cần kiểm chứng trước khi public.

## Evidence review thật trong vòng này
- Website havyqn.com hiện còn các lời khẳng định 30+ năm, 3.000+ công trình, cam kết phản hồi 2 giờ; chưa có hồ sơ xác minh đủ nên HAVY5 KHÔNG sao chép các số liệu đó. Website công khai còn địa chỉ 52 Tăng Bạt Hổ — đây là địa chỉ cũ bị loại khỏi HAVY5.
- Google Drive có tài liệu '05_NANG_TANG_CEMBOARD.txt' ở https://drive.google.com/file/d/18orBB7LZ1z8teqrxC5uqf_H_l2Fc9Wp_/view. Đây là bài marketing chưa được chứng thực, chứa nhận định về chịu lực, định lượng tải trọng/chi phí/thời gian, câu chuyện khách hàng và lời khuyên thay thế kết cấu; xếp UNG_VIEN/DO_NOT_PUBLISH, không dùng làm datasheet hoặc chứng cứ.
- Google Drive có 'MASTER_CATALOG_MA_HANG.xlsx' tại https://docs.google.com/spreadsheets/d/1XMgVEXlCrXiyjIiHe-FolhmSeMJwfmvu/edit và 'HA_VY_IMPORT_MA_HANG_TU_TAI_LIEU.xlsx' tại https://docs.google.com/spreadsheets/d/1dsTSLaHUpkNVw_VKqsNJcEXZWUQCqSB8/edit, có thể lập danh sách ứng viên SKU nhưng không tự động xác nhận giá/tồn kho.
- Các địa chỉ 157 Nguyễn Thái Học, 200 Hoàng Văn Thụ, 28 Hùng Vương theo hồ sơ Founder; hotline 0983 062 897 từ site cũ — cần xác nhận tình trạng sử dụng trước xuất bản.

## Quy tắc release
Mỗi dòng SKU muốn lên site cần: SKU ID, tên, nhóm, ứng dụng được phép, trường hợp không phù hợp, brand/spec/độ dày, bằng chứng/datasheet URL, ngày xem, trạng thái xác minh, last-reviewed, người duyệt. Nếu thiếu bằng chứng: dùng mô tả định tính và nút liên hệ, không phóng đại.
KHÔNG công bố sức chịu tải, chống cháy, chống nước, giá thấp nhất hay thời gian giao cam kết chỉ từ tên 'MDF/Plywood/Cemboard'.
Không gắn danh hiệu 100/100 khi chưa có dữ liệu chuyển đổi và kiểm thử hiệu năng/accessibility production.

## Owner / next deliverable
BÁCH: đối chiếu datasheet theo từng SKU thật.
MINH: cấu trúc kho sản phẩm và thông điệp theo 4 mức sự thật.
DUY: kết nối read-only dữ liệu xác minh vào website; fail-closed nếu thiếu.
GIANG: kiểm định độc lập danh mục và claim.
FOUNDER: phê duyệt dữ liệu chính chủ, giá/địa điểm/liên hệ, production Gate.
