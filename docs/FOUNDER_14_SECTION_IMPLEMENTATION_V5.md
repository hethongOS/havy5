# HAVY5 — Biên tập đề xuất 14 section của Founder / 2026-10-14

## Phạm vi
- Nguồn: `docs/FOUNDER_14_SECTION_PROPOSAL_20261014.md`, nội dung Founder gửi để đề xuất sửa havyqn.com.
- Quyết định hiện hành: HAVY5 là **website thế hệ mới**, không ghi đè havyqn.com. Thay đổi chỉ trong LAB và đề nghị PR KCS.
- 14 phần theo đề xuất: Hero; phân luồng 3 nhu cầu; chọn theo hạng mục; danh mục; ba điều nên biết; tư vấn 4 câu; quy trình; vì sao chọn Hà Vy; hình ảnh thật; đối tượng khách hàng; Chuyện từ kho; FAQ; CTA cuối; footer.

## Đã triển khai trong V5
1. Chép tinh thần và phần lớn nội dung 14 section lên trang chủ; đưa 2 CTA mục tiêu ở Hero: chưa biết chọn ván và đã có quy cách/kiểm giá. CTA thứ ba để chuẩn bị dự toán.
2. Xây `src/home14.mjs` và CSS riêng; giữ mô-đun còn lại để hạn chế phá cấu trúc V4.
3. Trang `/cam-nang/` là bài hướng dẫn minh bạch, KHÔNG giả làm câu chuyện khách hàng thật; trỏ từ Section 05/11.
4. `/vat-lieu/#phu-melamine` giải thích Melamine là lớp phủ, không giả lập SKU/giá.
5. Luồng báo giá nhận query parameter cố định từ CTA theo `muc-dich` (whitelist); không chèn dữ liệu người dùng chưa lọc vào HTML hoặc analytics.
6. Section 09 không đăng ảnh kho khi chưa có bản gốc chứng minh nguồn; hiển thị thông báo và các địa chỉ đã được Founder cung cấp.
7. Giữ nguyên `noindex` trong LAB và thông báo biểu mẫu chỉ tạo nội dung để người dùng tự gửi Zalo.

## Những điểm được điều chỉnh so với văn bản gốc
- Section 02 'Dự toán' mới là *chuẩn bị yêu cầu dự toán*, chưa tự tính số tấm; không hứa tính toán chưa có.
- Section 06 vẫn giữ bộ chọn V4 (hạng mục, môi trường, ưu tiên, ngân sách); bản đề xuất của Founder là (hạng mục, môi trường, ưu tiên, thông tin hiện có). Cần migration/test P06 để đổi câu 4 mà không ảnh hưởng dữ liệu handoff.
- Section 09 ảnh kho đang chờ ảnh thật; KHÔNG dùng mockup làm bằng chứng.
- Section 11 Chuyện từ kho là hướng dẫn tổng hợp, không tuyên bố đã có giao dịch/tình huống cụ thể.
- Section 14 số hotline/Zalo và giờ làm việc vẫn phải xác nhận trên nguồn vận hành trước production. Chưa công bố giờ làm việc chưa xác thực.
- Chưa nhập giá bán, mã SKU, tồn kho, tải trọng, chứng chỉ kỹ thuật nếu thiếu mã hàng + datasheet + KCS.

## Check KCS / Release Gate
- Node.js 22, `npm run lint`, `npm test`, `npm run build`.
- Homepage có đủ 14 id section theo đúng thứ tự; đầy đủ route và CTA; nguồn cũ 52 Tăng Bạt Hổ không xuất hiện.
- Responsive desktop/mobile 320px trở lên; kiểm chứng bởi screenshot thực tế (chưa thay cho Lighthouse/WCAG đầy đủ).
- Giá và tồn kho: chỉ xác minh khi liên hệ; Zalo/call ID: chờ Founder xác nhận.
- Production: NO. Không gộp main/đổi DNS hoặc auto-deploy khi chưa Founder Gate.
- '100 điểm' là mục tiêu. Không tự công bố 100/100 khi thiếu dữ liệu thật, accessibility/performance audit, E2E conversion và phép đo người dùng.

## Next owner và nghiệm thu
- Nội dung, ảnh kho, đầu số liên hệ: Founder cung cấp dữ liệu gốc; BÁCH đối chiếu với Notion/Drive, gắn provenance.
- Kỹ thuật: DUY/P06 kiểm thử route, tối ưu asset và thu gọn homepage khi có heatmap.
- KCS: GIANG/P07 kiểm tra toàn diện và chấm rubric 100 có bằng chứng.
- Tối ưu: P08 theo dõi funnel sau khi xuất bản và được phép đo lường; chỉ lúc đó đánh giá chất lượng chuyển đổi thực.
