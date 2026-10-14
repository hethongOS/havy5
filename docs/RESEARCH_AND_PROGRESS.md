# HAVY5 — TIẾN ĐỘ XƯỞNG WEBSITE / 2026-10-14

**STATUS: LAB WEBSITE BUILD + KCS PASS — NOT PUBLISHED.** Work ID: WEBFACTORY-HAVY-001. Production main và havyqn.com chưa thay đổi.

| Mã | Hạng mục | Trạng thái và bằng chứng |
|---|---|---|
| P01 | DNA / chiến lược | CƠ BẢN: định vị, 2 nhóm khách và 3 vật liệu đã đưa vào UI. Cần đối chiếu Notion BCM và mã sản phẩm thực. |
| P02 | Hành trình chuyển đổi | ĐÃ DỰNG: nhu cầu → 4 câu hỏi → gợi ý có cảnh báo → liên hệ Zalo. Chưa đo conversion thật. |
| P03 | Kiến trúc website | ĐÃ DỰNG: 8 trang tĩnh với URL riêng. |
| P04 | Nội dung theo section | ĐÃ DỰNG: trang chủ, danh mục, chi tiết MDF/Plywood/Cemboard, bộ chọn, liên hệ, về Hà Vy. Chưa dùng testimonial hay giá chưa xác minh. |
| P05 | UX/UI responsive | ĐÃ DỰNG & THỬ NGHIỆM: mobile menu, bộ lọc, wizard; 48 lượt kiểm tra không tràn ngang tại 6 kích thước. Chưa WCAG audit toàn diện. |
| P06 | Mã nguồn và build | PASS: Node SSG không dependency; npm run build tạo 8 trang, npm run lint PASS. |
| P07 | KCS độc lập LAB | PASS: 12/12 unit tests, 108 tổ hợp advisor, smoke browser, GitHub Actions KCS run 38493972783 PASS. Chưa qua Founder release gate. |
| P08 | Analytics / tối ưu | EVENT HOOKS: page_view, start_advisor, advisor_answer, advisor_complete, catalogue_filter, request_quote, contact_phone, contact_zalo, quote_message_prepared. Chưa tích hợp dịch vụ analytics. |

## Phần mềm đã có
- Source: src/site.mjs, src/styles.css, src/main.js, src/advisor.mjs, scripts/build.mjs, scripts/serve.mjs, tests/advisor.test.mjs.
- Routes: /, /chon-vat-lieu/, /vat-lieu/, /vat-lieu/mdf/, /vat-lieu/plywood/, /vat-lieu/cemboard/, /bao-gia/, /ve-ha-vy/.
- Form liên hệ **chỉ soạn văn bản trong trình duyệt**; khách copy, mở Zalo và tự bấm gửi. Không tự thu hoặc gửi PII lên server.
- Điện thoại/Zalo 0983 062 897 tham chiếu từ havyqn.com. **Cần xác minh trước công bố.**
- Địa chỉ theo Founder: 157 Nguyễn Thái Học; 200 Hoàng Văn Thụ; 28 Hùng Vương. Không đưa địa chỉ 52 Tăng Bạt Hổ.
- LAB noindex và robots disallow; production cần SEO setup riêng.

## Evidence
- [KCS Run PASS](https://github.com/hethongOS/havy5/actions/runs/38493972783)
- [PR #9 đã merge LAB](https://github.com/hethongOS/havy5/pull/9)
- [Báo cáo KCS](https://github.com/hethongOS/havy5/blob/lab/smart-website-factory-v1/docs/KCS_HAVY5_20261014.md)
- [Drive: mã nguồn + ảnh desktop/mobile](https://drive.google.com/drive/folders/1klb-rtWs252fIPP6bkZLN7_-lKTBl_n-)

## Các điểm còn chặn release
1. **Không cần Gemini key lúc này**: chỉ dùng để bật Antigravity worker sau này.
2. Xác minh hotline, địa điểm và dữ liệu mã hàng/tài liệu kỹ thuật với Founder trước public.
3. Kiểm định hành trình copy→Zalo bằng tài khoản nhận thật trước khi tuyên bố lead hoạt động thực.
4. Triển khai production SEO/canonical/sitemap, chính sách dữ liệu nếu thêm CRM/analytics, kiểm tra Lighthouse/WCAG.
5. Chưa có hosted preview vì chưa Founder Gate công khai. Đã có ảnh và ZIP trong Drive.
6. PR #7 vào main vẫn DRAFT; không tự merge, không kết nối domain.

KCS owner: GIANG / độc lập. Implementation owner: DUY / AI worker cloud. Decision owner: Founder.
