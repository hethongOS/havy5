# HAVY5 — LAB website tư vấn vật liệu

Website đa trang tiếng Việt cho Kho Ván Hà Vy (Quy Nhơn), thiết kế theo chiến lược “Chọn đúng vật liệu trước khi nói giá”. **Đây là bản LAB**, không phải website production. Không cần Gemini API key để dựng/chạy.

## Chạy trên máy hoặc CI

```bash
npm run build
npm test
npm run lint
npm run dev
```

Mở http://localhost:4173. Không cần npm install vì không có dependency bên ngoài; cần Node.js 20+.

## Các trang đã triển khai

- `/`: trang chủ chuyển đổi với thông điệp chọn đúng vật liệu.
- `/chon-vat-lieu/`: khảo sát 4 câu hỏi, kết quả theo quy tắc, cảnh báo kỹ thuật.
- `/vat-lieu/`: danh mục và bộ lọc MDF/Plywood/Cemboard.
- `/vat-lieu/mdf/`, `/vat-lieu/plywood/`, `/vat-lieu/cemboard/`: trang công năng và giới hạn từng nhóm.
- `/bao-gia/`: biểu mẫu mô phỏng **không thu hay gửi dữ liệu thật**; cần CRM/backend trước khi đưa production.
- `/ve-ha-vy/`: thông điệp và địa điểm Hà Vy.

## Nguồn dữ liệu, điểm chưa xác minh

- Tham chiếu công khai: https://havyqn.com/ (văn bản, đặc biệt cách trình bày nhu cầu).
- Ba địa chỉ theo DNA Founder: 157 Nguyễn Thái Học; 200 Hoàng Văn Thụ; 28 Hùng Vương. Cần kiểm tra trước khi lên production.
- Không sao chép tuyên bố 30+ năm/3.000+ công trình từ website cũ khi chưa có bằng chứng.
- Không sử dụng địa chỉ cũ 52 Tăng Bạt Hổ.
- Không hiển thị giá, tồn kho, lời chứng thực hay chứng nhận chưa kiểm định.
- Thiết kế hình minh họa bằng CSS, không sử dụng hình ảnh đối thủ hoặc stock ảnh không rõ quyền.

## Quy trình lên production

Chạy KCS (lints, unit tests, responsive, keyboard, form integration, factual claims, legal/privacy), liên kết CRM thật, đo analytics không gửi PII, thiết lập SEO và domain, sau đó mới Founder Gate. LAB đánh dấu noindex và robots disallow theo chủ đích.
