/** Trang chủ 14 section: biên tập từ đề xuất Founder 2026-10-14.
 * Phần chưa có khả năng thật được dẫn sang bước chuẩn bị yêu cầu, không hứa chức năng.
 */
export const homepageSections = Object.freeze([
  '01-hero', '02-nhu-cau', '03-hang-muc', '04-danh-muc', '05-kien-thuc',
  '06-tu-van', '07-quy-trinh', '08-vi-sao', '09-hinh-anh', '10-khach-hang',
  '11-chuyen-tu-kho', '12-faq', '13-hanh-dong', '14-footer'
]);

const examples = [
  ['Tủ bếp', 'Khu vực khô, nơi có ẩm và chỗ dễ tiếp xúc nước không có cùng yêu cầu vật liệu.', '/chon-vat-lieu/', 'Chọn ván cho tủ bếp'],
  ['Tủ áo & nội thất', 'Cân bằng bề mặt, khả năng gia công, điều kiện sử dụng và chi phí.', '/chon-vat-lieu/', 'Chọn ván nội thất'],
  ['Vách ngăn', 'Cần xét hệ khung, môi trường lắp đặt, yêu cầu hoàn thiện và giới hạn kỹ thuật.', '/chon-vat-lieu/', 'Chọn ván làm vách'],
  ['Sàn gác & tấm lót sàn', 'Không chọn tấm chỉ theo độ dày. Phải kiểm tải, nhịp, hệ khung và thiết kế.', '/bao-gia/?muc-dich=san-gac', 'Gửi điều kiện để tư vấn'],
  ['Khu vực ẩm hoặc có nước', 'Phân biệt ẩm không khí, nước tạt và tiếp xúc nước thường xuyên.', '/chon-vat-lieu/', 'Tìm hướng phù hợp'],
  ['Ngoài trời / khu vực nắng mưa', 'Cần đối chiếu thông số từng sản phẩm và điều kiện thi công thực tế.', '/bao-gia/?muc-dich=ngoai-troi', 'Hỏi về điều kiện ngoài trời']
];
const threeLearnings = [
  ['Chống ẩm không đồng nghĩa chịu nước', 'Ván dùng được trong môi trường ẩm chưa chắc phù hợp khi bị nước tạt hoặc tiếp xúc nước thường xuyên.', '/cam-nang/#chong-am'],
  ['Cùng tên ván chưa chắc cùng chất lượng', 'Cốt, bề mặt, độ dày và nhà sản xuất khác nhau có thể dẫn đến giá và phạm vi sử dụng khác nhau.', '/cam-nang/#so-quy-cach'],
  ['Tấm ván tốt không thay thế được kết cấu đúng', 'Với sàn gác hoặc hạng mục chịu tải, phải xét cả hệ kết cấu chứ không chỉ riêng độ dày.', '/cam-nang/#ket-cau']
];
const questions = [
  ['Hà Vy có báo giá ngay không?', 'Khi có tên hàng hoặc quy cách, số lượng và điều kiện giao nhận, Hà Vy có thể kiểm giá tại thời điểm tư vấn. Nếu chưa rõ sẽ hỏi thêm để tránh so nhầm.'],
  ['Chỉ có hình ảnh, không biết tên ván, có hỏi được không?', 'Được. Anh/chị hãy gửi ảnh qua Zalo, kèm mục đích sử dụng để cùng làm rõ thông tin cần thiết.'],
  ['Ván chống ẩm có chịu nước không?', 'Không nên đánh đồng. Cần phân biệt ẩm môi trường, nước tạt và tiếp xúc nước thường xuyên, đồng thời xem thông số mã hàng.'],
  ['Làm tủ bếp có cần ván đắt nhất không?', 'Không nhất thiết. Các vị trí sử dụng có yêu cầu khác nhau, cần so tuổi thọ kỳ vọng và ngân sách.'],
  ['Giá và tồn kho trên website có cập nhật theo thời gian thực?', 'Không. Giá và tình trạng hàng chỉ được xác nhận khi liên hệ tại thời điểm trao đổi.'],
  ['Tôi cần gửi gì để được kiểm giá nhanh?', 'Tên hoặc mã hàng, cốt, bề mặt, độ dày, kích thước, số lượng và nơi nhận; có thể bổ sung phần thiếu sau.'],
  ['Hà Vy có nhận thiết kế hoặc thi công không?', 'Hà Vy kinh doanh và tư vấn lựa chọn vật liệu, không thay thế đơn vị thiết kế, thi công hoặc chuyên gia tính toán kết cấu.']
];
const customers = [
  ['Thợ mộc / Xưởng nội thất', 'Cần đúng quy cách, mã hàng và hạn chế ảnh hưởng đến tiến độ.', 'Gửi mã hàng, kích thước, số lượng, thời gian cần.'],
  ['Nhà thầu / Đội thi công', 'Cần vật liệu phù hợp với yêu cầu kỹ thuật, hệ thi công và kế hoạch cung ứng.', 'Gửi bản vẽ, hạng mục, điều kiện sử dụng, tiến độ.'],
  ['Chủ nhà sửa nhà / Làm nội thất', 'Muốn hiểu lựa chọn trước khi chi tiền, tránh mua sai và trả thêm cho tính năng chưa cần.', 'Gửi ảnh vị trí, mục đích dùng và ngân sách dự kiến.']
];

export function renderHome14({ header, footer, button, eyebrow, materialCard, products, icon }) {
  const card = (title, copy, href, action, i) => `<article class="hv5-card"><span class="hv5-index">${String(i+1).padStart(2,'0')}</span><h3>${title}</h3><p>${copy}</p><a class="hv5-link" href="${href}">${action} <span aria-hidden="true">→</span></a></article>`;
  const sectionHead = (num, label, title, sub = '') => `<div class="hv5-section-head">${eyebrow(`${num} / ${label}`)}<h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div>`;
  return `${header('home')}<main id="main" class="hv5-home">
  <!-- 01 HERO -->
  <section id="section-01-hero" class="hero hv5-hero" aria-labelledby="hero-heading"><div class="wrap hero-grid">
    <div class="hero-copy">${eyebrow('KHO VÁN HÀ VY · QUY NHƠN')}<h1 id="hero-heading">Chọn đúng ván<br/>cho <em>đúng việc.</em><br/><span class="hv5-hero-last">Mua vừa nhu cầu, đúng ngân sách.</span></h1>
      <p class="hero-lead">Làm tủ bếp, tủ áo, vách ngăn hay chuẩn bị vật liệu cho công trình? Hà Vy giúp anh/chị hiểu điều kiện sử dụng, thu hẹp 1–2 hướng vật liệu và <strong>kiểm giá theo đúng quy cách</strong>.</p>
      <p class="hv5-hero-disclaimer">Không đẩy khách sang loại đắt hơn chỉ vì dễ bán.</p>
      <div class="hero-actions">${button('/chon-vat-lieu/','Tôi chưa biết chọn ván')}${button('/bao-gia/?muc-dich=kiem-gia','Tôi đã có quy cách — kiểm giá', true)}</div>
      <div class="hero-proof"><div class="proof-icon">${icon('shield')}</div><div><strong>Kho ván tại Quy Nhơn · 3 địa điểm liên hệ</strong><span>Giá và tình trạng hàng chỉ xác nhận khi trao đổi.</span></div></div>
    </div>
    <div class="hero-art" role="img" aria-label="Minh họa ba lớp tấm vật liệu, không phải ảnh thực tế hoặc mô tả sản phẩm cụ thể"><div class="hero-art-top"><span>HÀ VY · MATERIAL GUIDE</span><span>01 / 03</span></div><div class="hero-art-caption"><span>So đúng quy cách.<br/><em>Chọn đúng công năng.</em></span></div><div class="hero-board-stack"><div class="slab slab-one"><span></span></div><div class="slab slab-two"><span></span></div><div class="slab slab-three"><span></span></div></div><div class="hero-art-bottom"><span>ĐÚNG CÔNG NĂNG</span><span>ĐÚNG NGÂN SÁCH</span></div></div>
  </div></section>
  <!-- 02 Nhu cầu -->
  <section id="section-02-nhu-cau" class="section hv5-block"><div class="wrap">${sectionHead('02','ANH/CHỊ ĐANG CẦN GÌ?', 'Không cần biết tên ván mới bắt đầu được.')}
    <div class="hv5-card-grid cols-3">${card('Tôi chưa biết nên dùng loại ván nào','Nói việc cần làm, vị trí sử dụng và ngân sách dự kiến. Hà Vy giúp thu hẹp phương án.', '/chon-vat-lieu/','Chọn theo hạng mục',0)}${card('Tôi đã biết loại ván hoặc quy cách','Có tên hàng, độ dày hay mã ván? Gửi thông tin để kiểm giá, số lượng và tình trạng hàng.', '/bao-gia/?muc-dich=kiem-gia','Gửi quy cách kiểm giá',1)}${card('Tôi đang dự toán công trình','Chuẩn bị kích thước, hạng mục và số lượng để Hà Vy kiểm quy cách; chưa có tính năng tự tính số tấm.', '/bao-gia/?muc-dich=du-toan','Chuẩn bị yêu cầu dự toán',2)}</div>
  </div></section>
  <!-- 03 Hạng mục -->
  <section id="section-03-hang-muc" class="section hv5-block hv5-tint"><div class="wrap">${sectionHead('03','CHỌN THEO CÔNG VIỆC','Anh/chị đang định làm gì?','Nên xét nơi sử dụng trước, rồi mới so loại ván và giá.')}
    <div class="hv5-card-grid cols-3">${examples.map((c,i)=>card(...c,i)).join('')}</div>
    <p class="hv5-note">Không thấy hạng mục của mình? ${button('/bao-gia/','Mô tả để Hà Vy tư vấn',true)}</p>
  </div></section>
  <!-- 04 Danh mục -->
  <section id="section-04-danh-muc" class="section products-section"><div class="wrap">${sectionHead('04','DANH MỤC VÁN CÔNG NGHIỆP','Tìm đúng loại ván. So đúng quy cách.','Giá mỗi tấm chỉ có ý nghĩa khi so cùng cốt, bề mặt, độ dày và điều kiện sử dụng.')}
    <div class="product-grid">${products.map(materialCard).join('')}</div>
    <div class="hv5-melamine"><div><h3>Melamine là bề mặt phủ, không phải cốt ván.</h3><p>Chọn màu và bề mặt cùng cốt ván phù hợp. Lớp phủ đẹp không thay thế việc chọn đúng cốt.</p></div><a href="/vat-lieu/#phu-melamine" class="hv5-link">Hiểu về bề mặt Melamine →</a></div>
    <a class="hv5-link hv5-link-more" href="/vat-lieu/">Xem các nhóm vật liệu →</a>
  </div></section>
  <!-- 05 Kiến thức -->
  <section id="section-05-kien-thuc" class="section hv5-block hv5-tint"><div class="wrap">${sectionHead('05','BA ĐIỀU NÊN BIẾT','Có những khác biệt nhỏ khi mua, nhưng rất lớn khi sử dụng.')}
    <div class="hv5-card-grid cols-3">${threeLearnings.map(([title,copy,href],i)=>card(title,copy,href,'Đọc giải thích',i)).join('')}</div>
    <p class="hv5-principle">Không có một loại ván tốt nhất cho mọi trường hợp. Hà Vy giúp tìm lựa chọn phù hợp hơn với công việc thực tế.</p>
  </div></section>
  <!-- 06 Tư vấn -->
  <section id="section-06-tu-van" class="section selection-section"><div class="wrap selection-grid"><div><span class="eyebrow light"><span class="eyebrow-dot"></span>06 / TƯ VẤN CHỌN VẬT LIỆU</span><h2>Chưa biết tên ván?<br/><em>Bắt đầu bằng 4 câu.</em></h2><p>Không cần thuật ngữ kỹ thuật. Bộ tư vấn LAB đưa ra hướng tham khảo và cảnh báo cần xác minh; không thay thế kiểm tra kết cấu.</p>${button('/chon-vat-lieu/','Bắt đầu trả lời')}</div><div class="steps"><div class="step"><span>01</span><div><strong>Anh/chị định làm gì?</strong><small>Tủ bếp, tủ áo, vách ngăn, sàn hay hạng mục khác</small></div></div><div class="step"><span>02</span><div><strong>Vị trí sử dụng có điều kiện nào?</strong><small>Khô, ẩm, ngoài trời; có nước tạt cần mô tả rõ</small></div></div><div class="step"><span>03</span><div><strong>Ưu tiên điều gì nhất?</strong><small>Thẩm mỹ, độ bền hay tiết kiệm</small></div></div><div class="step"><span>04</span><div><strong>Ngân sách dự kiến?</strong><small>Tiết kiệm, cân bằng hoặc đầu tư lâu dài; bổ sung ảnh/bản vẽ tại bước liên hệ</small></div></div></div></div></section>
  <!-- 07 Quy trình -->
  <section id="section-07-quy-trinh" class="section method-section"><div class="wrap">${sectionHead('07','HÀ VY TƯ VẤN NHƯ THẾ NÀO?','Từ nhu cầu thực tế đến lựa chọn có căn cứ.')}
    <div class="hv5-card-grid cols-4">${[
      ['Nói việc cần làm','Hạng mục, vị trí và thời điểm dự kiến cần vật liệu.'],
      ['Làm rõ điều kiện','Môi trường ẩm/nước, tải, hệ khung, tuổi thọ, kích thước, ngân sách.'],
      ['So sánh phương án','Giải thích ưu điểm, giới hạn và điều kiện sử dụng của 1–2 hướng vật liệu.'],
      ['Kiểm giá và tình trạng hàng','Xác định mã/quy cách rồi kiểm giá, tồn kho và phương án giao nhận.']
    ].map(([title,copy],i)=>card(title,copy,'/bao-gia/','Gửi thông tin',i)).join('')}</div>
    <p class="hv5-note">Kết quả mong muốn: khách hiểu lý do lựa chọn và các điểm cần kiểm chứng trước khi mua.</p>
  </div></section>
  <!-- 08 Vì sao -->
  <section id="section-08-vi-sao" class="section hv5-block hv5-tint"><div class="wrap">${sectionHead('08','VÌ SAO CHỌN HÀ VY?','Bán đúng thứ anh/chị cần, không phải thứ dễ bán nhất.')}
    <div class="hv5-card-grid cols-4">${[
      ['Hỏi đúng việc trước khi bán','Một tủ bếp và một hệ sàn gác không thể được tư vấn như nhau.'],
      ['Nói rõ điều nên và không nên dùng','Không có vật liệu phù hợp cho mọi môi trường và ngân sách.'],
      ['So giá trên cùng quy cách','Làm rõ cốt, bề mặt, độ dày, số lượng và điều kiện giao nhận.'],
      ['Không hứa khi chưa kiểm tra','Giá, hàng sẵn và thời gian giao phải kiểm tại thời điểm trao đổi.']
    ].map(([t,d],i)=>card(t,d,'/bao-gia/','Trao đổi nhu cầu',i)).join('')}</div>
    <p class="hv5-principle">“Chọn đúng vật liệu trước khi nói giá” không phải là né giá. Đó là cách để báo đúng thứ khách cần mua.</p>
  </div></section>
  <!-- 09 Hình ảnh thật -->
  <section id="section-09-hinh-anh" class="section hv5-block"><div class="wrap hv5-split"> <div>${sectionHead('09','GẶP HÀ VY Ở QUY NHƠN','Kho hàng thật. Địa điểm thật. Người bán hàng thật.')}<p>Hình ảnh kho, khu lưu trữ và giao nhận sẽ được bổ sung sau khi chọn ảnh gốc có thể xác minh. Bản LAB hiện không dùng ảnh minh họa làm ảnh kho thật.</p><p><strong>Ba địa điểm liên hệ:</strong> 157 Nguyễn Thái Học · 200 Hoàng Văn Thụ · 28 Hùng Vương, Quy Nhơn.</p><p>Vui lòng liên hệ trước để kiểm tra địa điểm có mã hàng cần nhận.</p>${button('/ve-ha-vy/','Xem câu chuyện Hà Vy')}${button('/bao-gia/','Hỏi hàng tại kho',true)}</div><div class="hv5-photo-placeholder" role="note">${icon('location')}<strong>Đang bổ sung ảnh kho đã xác minh</strong><span>Không thay ảnh chụp thực tế bằng ảnh quảng cáo giả.</span></div></div></section>
  <!-- 10 Khách hàng -->
  <section id="section-10-khach-hang" class="section hv5-block hv5-tint"><div class="wrap">${sectionHead('10','HÀ VY PHỤC VỤ AI?','Mỗi người mua ván cần một kiểu hỗ trợ khác nhau.')}
    <div class="hv5-card-grid cols-3">${customers.map(([title,copy,prompt],i)=>card(title,`${copy}<br/><strong>Nên gửi:</strong> ${prompt}`,'/bao-gia/','Tư vấn cho trường hợp của tôi',i)).join('')}</div>
  </div></section>
  <!-- 11 Chuyện từ kho -->
  <section id="section-11-chuyen-tu-kho" class="section hv5-block"><div class="wrap">${sectionHead('11','CHUYỆN TỪ KHO','Những bài học trước khi đặt ván.','Đây là kiến thức tổng hợp phục vụ khách mua hàng, không phải lời chứng thực hay tình huống khách hàng đã được kiểm chứng.')}
    <div class="hv5-editorial"><div><span class="hv5-index">GÓC KINH NGHIỆM</span><h3>Vì sao có mã ván không thể hỏi là có ngay?</h3><p>Quy cách ít phổ biến có thể cần thời gian xác minh hoặc chuẩn bị nguồn hàng. Nếu sát ngày thi công mới hỏi, kế hoạch có thể bị ảnh hưởng.</p><p><strong>Bài học:</strong> Gửi mã, số lượng và thời điểm cần hàng sớm để kiểm tra trước khi chốt tiến độ.</p><a href="/cam-nang/#nguon-hang" class="hv5-link">Đọc bài hướng dẫn →</a></div><div><h3>Chủ đề nên đọc tiếp</h3><a href="/cam-nang/#chong-am">Chống ẩm và chịu nước khác nhau thế nào? →</a><a href="/cam-nang/#so-quy-cach">Vì sao không nên chỉ so giá theo tên gọi? →</a><a href="/cam-nang/#chu-bi">Cần chuẩn bị gì trước khi hỏi mua ván? →</a><a class="hv5-link" href="/cam-nang/">Xem toàn bộ cẩm nang →</a></div></div>
  </div></section>
  <!-- 12 FAQ -->
  <section id="section-12-faq" class="section faq-section"><div class="wrap faq-grid"><div>${eyebrow('12 / CÂU HỎI THƯỜNG GẶP')}<h2>Hỏi trước.<br/><em>Quyết định rõ hơn.</em></h2><p>Giá, tồn kho và thời gian giao không hiển thị thời gian thực. Khi cần, hãy gửi quy cách để kiểm tra.</p>${button('/bao-gia/','Gửi câu hỏi cho Hà Vy',true)}</div><div class="faqs">${questions.map(([q,a])=>`<details><summary>${q} ${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div></div></section>
  <!-- 13 CTA cuối -->
  <section id="section-13-hanh-dong" class="dark-cta"><div class="wrap dark-cta-inner"><div><span class="eyebrow light"><span class="eyebrow-dot"></span>13 / BẮT ĐẦU TỪ NHU CẦU</span><h2>Chưa biết chọn loại ván nào<br/><em>cũng không sao.</em></h2><p>Hãy cho Hà Vy biết anh/chị đang định làm gì. Làm rõ vật liệu trước khi kiểm mã, giá và tình trạng kho.</p></div><div class="dark-cta-actions">${button('/chon-vat-lieu/','Bắt đầu chọn vật liệu')}${button('/bao-gia/','Nhắn Zalo cho Hà Vy',true)}<a class="hv5-lightlink" href="/bao-gia/?muc-dich=kiem-gia">Đã biết mã hàng? Gửi quy cách để kiểm giá →</a></div></div></section>
  </main>${footer()}`;
}
