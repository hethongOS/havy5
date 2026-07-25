# Havy5 · Quỹ có phanh

Mô hình **bạn bỏ vốn – AI tự kinh doanh có phanh**.

- Niche mặc định: **sản phẩm số** (template, khóa học nhẹ, tool nhỏ, content pack)
- 3 điểm duyệt: **sản phẩm · ngân sách/mẫu tin · ngoại lệ**
- Phanh cứng: **cấm tự chuyển khoản**, **cấm tự tăng ads**, trần chi/ngày

## Chạy local

```bash
npm install
npm run dev
```

## Kiểm thử phanh quỹ

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Cấu trúc

| Đường dẫn | Ý nghĩa |
| --- | --- |
| [`config/company.json`](config/company.json) | Niche, vốn, trần chi, 3 điểm duyệt |
| [`agents/`](agents/) | Hồ sơ OpenClaw (`AGENTS.md`, `SOUL.md`) cho Điều phối / Sản phẩm / Khách / Bán |
| [`src/lib/fund.ts`](src/lib/fund.ts) | Logic quỹ + phanh |
| [`src/App.tsx`](src/App.tsx) | Dashboard Chủ quỹ |

## Cách dùng nhanh trên dashboard

1. Chọn 1 sản phẩm AI đề xuất (điểm duyệt #1)
2. Đồng ý ngân sách / mẫu tin (điểm duyệt #2)
3. Bấm **chốt 1 đơn** để mô phỏng bán trong luật
4. Thử **tự chuyển khoản** / **tự tăng ads** / **giảm 50%** — phanh phải chặn và tạo duyệt ngoại lệ
5. Xem **báo cáo ngày** + sổ quỹ

## Ranh giới

Đây là MVP mô phỏng vận hành + luật quỹ. Chưa nối payment gateway / ads thật. Agent profiles sẵn sàng gắn OpenClaw Gateway khi bạn triển khai VPS.
