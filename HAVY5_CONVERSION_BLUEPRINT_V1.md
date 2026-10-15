# HAVY5 — BLUEPRINT WEBSITE CHUYỂN ĐỔI V1.0
Trạng thái: SPEC_READY / BUILD_NOT_STARTED. Phạm vi: nhánh LAB; không chỉnh production.
## DNA / nguyên tắc
Kho Ván Hà Vy tại Quy Nhơn; MDF, Plywood, Cemboard; không bán sai công năng, không nhận vai trò thầu thi công. Khách chính: chủ nhà sửa nhà, thợ/xưởng, thầu và doanh nghiệp nội thất. Giá/tồn kho/giao hàng chỉ hiển thị khi được xác minh. Địa chỉ hợp lệ cần xác nhận theo từng điểm: 157 Nguyễn Thái Học; 200 Hoàng Văn Thụ; 28 Hùng Vương. Không sử dụng 52 Tăng Bạt Hổ.
## Sitemap mục tiêu
/ — Hero nêu giá trị 'Chọn đúng vật liệu trước khi nói giá', 2 CTA 'Chọn vật liệu' và 'Liên hệ Hà Vy'; lựa chọn theo hạng mục, nỗi đau, cách Hà Vy tư vấn, nhóm vật liệu, chứng cứ thực tế, FAQ, liên hệ.
/chon-vat-lieu — wizard 4 bước: (1) hạng mục/sử dụng (2) môi trường ẩm/khô (3) yêu cầu độ bền (4) ngân sách; đầu ra gồm vật liệu gợi ý, lý do, giới hạn, cảnh báo cần xác minh; CTA yêu cầu báo giá.
/vat-lieu — danh mục MDF/Plywood/Cemboard, bộ lọc công năng, không gán tính năng thiếu bằng chứng.
/vat-lieu/:slug — thông số có nguồn, ứng dụng phù hợp/không phù hợp, lựa chọn thay thế, CTA.
/bao-gia — form tên, số điện thoại, hạng mục, nhu cầu, đồng ý xử lý dữ liệu; phản hồi trạng thái gửi thành công/thất bại.
/ve-ha-vy — câu chuyện, địa chỉ đã xác minh, nguyên tắc tư vấn, kênh liên hệ.
## Design/UX
Mobile-first 360px; điều hướng rõ, CTA nổi bật nhưng không che nội dung; text tương phản WCAG AA; bàn phím; focus; trạng thái loading/error; không dùng lời chứng thực giả.
## Event taxonomy
view_home, start_advisor, answer_question, complete_advisor, view_product, request_quote, submit_quote_success, submit_quote_failure, contact_click. Không gửi PII vào analytics.
## Kiểm định
Score: chiến lược 15, khách hàng 15, nội dung 15, UX 15, tư vấn/chuyển đổi 15, SEO/performance/a11y 10, bảo mật/dữ liệu 10, đo lường 5. Gate >=85, P0/P1=0, form end-to-end PASS, mobile PASS, KCS evidence, Founder approval.
## Kế hoạch kỹ thuật
1. Kiểm kê tree và xác nhận framework; không giả định repo đã có web chạy.
2. Triển khai route + component theo framework thực tế, ưu tiên reuse.
3. Tách content/config khỏi UI; lưu DNA/industry pack có version.
4. Chạy lint/typecheck/build/test, kiểm thử form, Lighthouse và keyboard.
5. PR vào main chỉ sau KCS; không auto-publish.
## 8 master prompt — điều kiện giao nhận
P01 Strategy → DNA, persona, pain, USP có evidence.
P02 Conversion → funnel, primary CTA, micro events, acceptance.
P03 IA → sitemap, wireframe, routes, cross-links.
P04 Copy → từng section headline/body/proof/CTA, cấm bịa số liệu.
P05 UX → responsive components, states, a11y criteria.
P06 Build → tickets, APIs, data models, tests, migration safety.
P07 KCS → checklist, severity, logs/screenshots, score, verdict.
P08 Optimize → funnel events, experiment hypotheses, measurement plan.
Mỗi prompt phải trả input version, assumptions, evidence IDs, output, blockers, acceptance, next owner.
