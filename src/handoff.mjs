import { advise, answers } from './advisor.mjs';

// Chỉ chuyển lựa chọn cố định, không chuyển số điện thoại/tên/thông tin cá nhân trong URL.
const fieldMap = Object.freeze({
  use: 'hang-muc',
  moisture: 'moi-truong',
  priority: 'uu-tien',
  budget: 'ngan-sach'
});
const optionLabels = Object.freeze({
  use: { 'noi-that':'Tủ áo / nội thất phòng', 'tu-ke':'Tủ bếp / kệ / hệ tủ', 'vach-tran':'Vách ngăn / trần', 'san-ngoai':'Sàn / ngoài trời' },
  moisture: { kho:'Trong nhà, khô ráo', am:'Có nguy cơ ẩm', 'ngoai-troi':'Ngoài trời' },
  priority: { 'tham-my':'Thẩm mỹ', 'do-ben':'Độ bền / liên kết', 'tiet-kiem':'Tối ưu chi phí' },
  budget: { 'tiet-kiem':'Tiết kiệm', 'can-bang':'Cân bằng', 'dau-tu':'Đầu tư lâu dài' }
});

export function createAdvisorHandoff(input) {
  const result = advise(input);
  const params = new URLSearchParams();
  for (const [key, queryKey] of Object.entries(fieldMap)) params.set(queryKey, input[key]);
  params.set('vat-lieu', result.slug);
  return `/bao-gia/?${params.toString()}`;
}

export function readAdvisorHandoff(params) {
  const query = params instanceof URLSearchParams ? params : new URLSearchParams(params);
  const input = {};
  for (const [key, queryKey] of Object.entries(fieldMap)) {
    const value = query.get(queryKey);
    if (!answers[key].includes(value)) return null;
    input[key] = value;
  }
  // Không tin trường vật liệu trong URL nếu không khớp kết quả từ quy tắc.
  const result = advise(input);
  return { input, material: result.slug, materialName: result.material };
}

export function formatAdvisorHandoff(input) {
  advise(input);
  return [
    `Hạng mục: ${optionLabels.use[input.use]}`,
    `Môi trường: ${optionLabels.moisture[input.moisture]}`,
    `Ưu tiên: ${optionLabels.priority[input.priority]}`,
    `Ngân sách: ${optionLabels.budget[input.budget]}`
  ].join('\n');
}
