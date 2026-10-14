export const answers = Object.freeze({
  use: ['noi-that', 'tu-ke', 'vach-tran', 'san-ngoai'],
  moisture: ['kho', 'am', 'ngoai-troi'],
  priority: ['tham-my', 'do-ben', 'tiet-kiem'],
  budget: ['tiet-kiem', 'can-bang', 'dau-tu']
});

/** Gợi ý sơ bộ, KHÔNG thay thế kiểm tra quy cách và tài liệu kỹ thuật. */
export function advise(input) {
  if (!input || Object.entries(answers).some(([k, allowed]) => !allowed.includes(input[k]))) {
    throw new TypeError('Vui lòng hoàn tất cả bốn câu trả lời hợp lệ.');
  }
  const { use, moisture, priority, budget } = input;
  if (use === 'san-ngoai') {
    return {
      material: 'Cemboard (cần xác minh dòng, độ dày và kết cấu)',
      slug: 'cemboard',
      confidence: 'Cần chuyên gia xác minh',
      description: 'Hạng mục sàn/ngoài trời cần xem xét đồng thời tấm, khoảng cách khung, tải sử dụng, liên kết và hướng dẫn của nhà sản xuất.',
      caveat: 'Không suy ra khả năng chịu tải từ tên vật liệu. Không thi công kết cấu chỉ dựa vào kết quả này.',
      reasons: ['Môi trường và tải trọng là yếu tố quyết định.', 'Cần đối chiếu bản vẽ, tài liệu kỹ thuật và điều kiện thi công.']
    };
  }
  if (moisture === 'ngoai-troi') {
    return {
      material: 'Cemboard / giải pháp ngoài trời theo hệ thống',
      slug: 'cemboard',
      confidence: 'Cần kiểm tra hệ thống',
      description: 'Môi trường ngoài trời đòi hỏi lựa chọn vật liệu và phương án hoàn thiện phù hợp theo tài liệu nhà sản xuất.',
      caveat: 'Không mặc định mọi loại Cemboard chống nước hoàn toàn hoặc chịu lực như nhau.',
      reasons: ['Độ ẩm và thời tiết ảnh hưởng lựa chọn.', 'Phải kiểm tra bề mặt phủ, mối nối và liên kết.']
    };
  }
  if (use === 'vach-tran' && moisture === 'am') {
    return {
      material: 'Cemboard hoặc vật liệu chuyên dụng theo điều kiện ẩm', slug: 'cemboard',
      confidence: 'Gợi ý ban đầu',
      description: 'Với khu vực ẩm, cần đối chiếu đúng sản phẩm cho vách hoặc trần, không chọn chỉ theo tên vật liệu.',
      caveat: 'Kiểm tra tải treo, kết cấu khung, thông số của tấm và hướng dẫn lắp đặt.',
      reasons: ['Ưu tiên kiểm soát rủi ro ẩm.', 'Tránh đánh đồng các loại tấm có công năng khác nhau.']
    };
  }
  if (moisture === 'am') {
    return {
      material: 'Plywood phù hợp điều kiện ẩm hoặc MDF chống ẩm đúng cấp', slug: 'plywood',
      confidence: 'Gợi ý ban đầu',
      description: 'Nên kiểm tra cốt, keo, cạnh tấm, bề mặt phủ và điều kiện tiếp xúc ẩm thực tế trước khi chọn.',
      caveat: '“Chống ẩm” không đồng nghĩa “ngâm nước được”. Yêu cầu đối chiếu datasheet sản phẩm.',
      reasons: ['Môi trường ẩm cần xét cả lõi và cạnh tấm.', 'Chất lượng phụ thuộc chủng loại cụ thể, không chỉ nhãn MDF/Plywood.']
    };
  }
  if (priority === 'do-ben' || use === 'tu-ke' && budget === 'dau-tu') {
    return {
      material: 'Plywood phù hợp công năng', slug: 'plywood',
      confidence: 'Gợi ý ban đầu',
      description: 'Plywood là một phương án cần so sánh khi chú trọng liên kết, độ bền và kết cấu tủ/kệ; hiệu quả phụ thuộc đúng loại và thiết kế.',
      caveat: 'Không suy ra sức chịu tải hay độ bền từ tên “Plywood” chung chung.',
      reasons: ['Ưu tiên đánh giá loại lõi và yêu cầu liên kết.', 'Cần xét chất lượng bề mặt, độ dày và ngân sách.']
    };
  }
  return {
    material: 'MDF phù hợp môi trường khô', slug: 'mdf',
    confidence: 'Gợi ý ban đầu',
    description: 'Với nội thất khô và nhu cầu bề mặt phẳng, MDF có thể là điểm khởi đầu để so sánh quy cách và lớp phủ.',
    caveat: 'Không dùng MDF thường ở nơi ẩm kéo dài. Cần kiểm tra tải, độ dày, lớp phủ và cạnh tấm.',
    reasons: [priority === 'tiet-kiem' || budget === 'tiet-kiem' ? 'Bắt đầu từ phương án theo ngân sách, không cam kết giá chưa xác minh.' : 'Bắt đầu từ nhu cầu bề mặt và tính thẩm mỹ.', 'Loại cốt và điều kiện sử dụng phải được xác minh trước khi mua.']
  };
}
