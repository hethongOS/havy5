# HAVY5 — BẢNG ĐIỂM CHUYỂN ĐỔI / LAB V4

Đánh giá **sơ bộ theo kiểm thử mã nguồn và chức năng**; không phải Lighthouse, audit WCAG đầy đủ hay tỷ lệ chuyển đổi thực tế. Chưa đạt release gate; không quảng cáo 100 điểm.

| Trục | Trọng số | Điểm sơ bộ | Khoảng trống cần nghiệm thu |
|---|---:|---:|---|
| Chiến lược + DNA | 15 | 11 | Xác minh hồ sơ BCM, địa chỉ, hotline, lợi thế có bằng chứng |
| Hiểu khách hàng + hành trình | 15 | 13 | Phỏng vấn định tính chủ nhà và thầu nội thất; đo funnel |
| Nội dung + chứng cứ | 15 | 10 | SKU/datasheet, ảnh kho thật, ví dụ thi công, bằng chứng giao hàng |
| UX/UI + trợ năng | 15 | 12 | Audit WCAG với screen reader và tương phản thực tế |
| Chuyển đổi + chức năng | 15 | 11 | Dòng lead thật, Zalo/CRM end-to-end, bảo vệ dữ liệu |
| SEO + hiệu năng | 10 | 5 | Chưa có domain production, indexability, Lighthouse và field vitals |
| Bảo mật + dữ liệu + mở rộng | 10 | 8 | Thiết lập chính sách dữ liệu khi lưu CRM, CSP hosting, thử nghiệm bảo mật |
| Đo lường và tối ưu | 5 | 2 | Kết nối analytics, conversion goals, A/B experiment, consent |
| **TỔNG** | **100** | **72** | **Đánh giá LAB sơ bộ, chưa thể chấm 100 chính thức** |

## Việc cần làm theo ưu tiên
**P0:** xác minh hotline/Zalo + địa chỉ; kiểm chứng vật liệu theo SKU/datasheet; đảm bảo không có thông tin sai công năng.
**P1:** ảnh và chứng cứ thực; chính sách xử lý dữ liệu khi có CRM; backend hoặc quy trình tiếp nhận lead thật; Lighthouse mobile; screen-reader; bảo mật hosting; hostname và sitemap khi công bố.
**P2:** phân tích funnel, conversion baseline, bài thử CTA bằng số liệu thực, FAQ/schema tùy điều kiện; quy trình giữ và cải thiện điểm sau triển khai.

**Trách nhiệm:** BÁCH (P01 chứng cứ), MINH (nội dung và PRD), DUY (P05–P06), GIANG (KCS/P07), Founder (Gate công khai/chi phí/dữ liệu thật). Mọi claim ngoài bằng chứng phải ghi NEEDS_VERIFICATION.
