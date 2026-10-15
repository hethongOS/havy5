import { getCatalogMeta } from './catalog.mjs';
export const pageMeta = Object.freeze({
  '/': { title:'Chọn đúng ván cho đúng việc', description:'Khám phá cách chọn MDF, Plywood, Cemboard theo hạng mục, môi trường sử dụng và ngân sách tại Kho Ván Hà Vy, Quy Nhơn.' },
  '/chon-vat-lieu/': { title:'Chọn vật liệu qua 4 câu hỏi', description:'Trả lời 4 câu hỏi về hạng mục, độ ẩm, ưu tiên và ngân sách để có gợi ý ban đầu cùng những cảnh báo cần kiểm tra.' },
  '/vat-lieu/': { title:'Danh mục MDF, Plywood và Cemboard', description:'So sánh tính chất và giới hạn sử dụng của ba nhóm vật liệu MDF, Plywood, Cemboard trước khi chọn mã hàng thực tế.' },
  '/vat-lieu/mdf/': { title:'MDF: công năng và lưu ý', description:'MDF phù hợp với hạng mục nào, trường hợp nào cần thận trọng, và nên hỏi gì về cốt, lớp phủ, độ dày?' },
  '/vat-lieu/plywood/': { title:'Plywood: công năng và lưu ý', description:'Tìm hiểu ván dán Plywood, yêu cầu về lớp lõi, loại keo, môi trường, liên kết và các câu hỏi trước khi mua.' },
  '/vat-lieu/cemboard/': { title:'Cemboard: công năng và giới hạn', description:'Cemboard cần được chọn theo đúng ứng dụng, hệ khung và datasheet; không suy ra tải trọng chỉ từ tên vật liệu.' },
  '/bao-gia/': { title:'Chuẩn bị yêu cầu tư vấn và báo giá', description:'Soạn mô tả hạng mục và chủ động gửi qua Zalo hoặc liên hệ Kho Ván Hà Vy để trao đổi vật liệu cần dùng.' },
  '/ve-ha-vy/': { title:'Về Kho Ván Hà Vy Quy Nhơn', description:'Tìm hiểu cách Hà Vy tư vấn MDF, Plywood, Cemboard theo nguyên tắc đúng công năng và phù hợp ngân sách.' },
  '/cam-nang/': { title:'Chuyện từ kho: cách chọn và so ván', description:'Cẩm nang lựa chọn MDF, Plywood, Cemboard: chống ẩm, so đúng quy cách, kiểm hệ khung và hỏi giá đúng thông tin.' },
  '/chinh-sach-du-lieu/': { title:'Thông tin bảo vệ dữ liệu và quyền riêng tư', description:'Tìm hiểu website HAVY5 LAB xử lý câu trả lời tư vấn, nội dung yêu cầu báo giá và sự kiện đo lường trong trình duyệt như thế nào.' }
});

export function escapeAttribute(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
export function renderMeta(path) {
  const data = pageMeta[path] || getCatalogMeta(path) || { title:'Không tìm thấy trang', description:'Nội dung được yêu cầu không tồn tại.' };
  const title = escapeAttribute(`${data.title} | Kho Ván Hà Vy`);
  const desc = escapeAttribute(data.description);
  // LAB luôn noindex; tuyệt đối không đặt canonical production trước khi duyệt hostname.
  return `<title>${title}</title><meta name="description" content="${desc}"/><meta name="robots" content="noindex,nofollow"/><meta property="og:type" content="website"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${desc}"/><meta name="twitter:card" content="summary"/>`;
}
