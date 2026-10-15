/**
 * websiteContext - Lớp dữ liệu kinh doanh & tư liệu giao diện chuẩn BCM V2 cho HAVY5
 * Tách biệt dữ liệu public được duyệt với dữ liệu nội bộ / bí mật.
 * Tuyệt đối không chứa secret, API key hay số liệu tồn kho / giá vốn giả định.
 */

export const websiteContext = Object.freeze({
  business: {
    name: 'Kho Ván Hà Vy',
    city: 'Quy Nhơn',
    fullName: 'Kho Ván & Vật Liệu Tấm Hà Vy — Quy Nhơn',
    tagline: 'Chọn đúng ván cho đúng việc — Không bán sai công năng',
    hotline: '0983 062 897',
    hotlineRaw: '0983062897',
    zaloUrl: 'https://zalo.me/0983062897',
    locations: [
      { id: 'loc-1', address: '157 Nguyễn Thái Học', city: 'Quy Nhơn', role: 'Văn phòng & điểm liên hệ' },
      { id: 'loc-2', address: '200 Hoàng Văn Thụ', city: 'Quy Nhơn', role: 'Kho trung tâm & tiếp nhận' },
      { id: 'loc-3', address: '28 Hùng Vương', city: 'Quy Nhơn', role: 'Điểm tập kết vật liệu' }
    ],
    boundaries: {
      noContracting: 'Chỉ tư vấn & cung ứng vật liệu tấm, không làm thầu thi công',
      noCredit: 'Chính sách tiền mặt / thanh toán ngay, không mở công nợ thương mại',
      verificationRequired: 'Giá và tình trạng sẵn hàng xác nhận trực tiếp tại thời điểm trao đổi'
    }
  },

  brand: {
    positioning: 'Nhà cung ứng đa dạng ván và vật liệu tấm công nghiệp tại Quy Nhơn; lấy năng lực hiểu vật liệu, công năng, kết cấu và lựa chọn đúng ngân sách làm lợi thế khác biệt.',
    coreOffer: 'Đúng ván, đúng việc, phù hợp ngân sách — Không bán sai công năng, không làm thầu thi công.',
    principles4D: [
      {
        num: '01',
        title: 'Đúng chủng loại',
        detail: 'Khảo sát kỹ vị trí lắp đặt và điều kiện môi trường trước khi đề xuất cốt ván.'
      },
      {
        num: '02',
        title: 'Đúng độ dày',
        detail: 'Đối chiếu kết cấu chịu lực, khẩu độ đà đỡ; không đoán mò quy cách.'
      },
      {
        num: '03',
        title: 'Đúng chống ẩm',
        detail: 'Phân định rõ khu vực khô ráo, ẩm định kỳ hay đọng nước để chọn lõi thường, lõi xanh hay ván chịu nước.'
      },
      {
        num: '04',
        title: 'Đúng ngân sách',
        detail: 'Tra cứu giá kho thực tế; tối ưu tổng chi phí sử dụng thay vì chỉ nhìn vào giá mua ban đầu.'
      }
    ]
  },

  personas: [
    {
      id: 'CD-NAM',
      name: 'Nam — Thầu thi công & Xưởng nội thất',
      tag: 'Nhà thầu / Thợ mộc / Xưởng',
      pain: 'Tiến độ gấp, chậm ván là trễ công trình; rủi ro bảo hành nếu chọn sai cốt ván hoặc bề mặt phủ kém chất lượng.',
      intent: 'Tôi đã có quy cách → Kiểm giá hiện hành và khả năng xuất kho',
      ctaText: 'Tôi đã có quy cách — kiểm giá',
      ctaHref: '/bao-gia/?muc-dich=kiem-gia',
      secondaryHref: '/san-pham/',
      needs: 'Gửi mã hàng, kích thước, số lượng, độ dày, thời gian cần để kiểm tra kho xuất ngay.'
    },
    {
      id: 'CD-LAN',
      name: 'Lan — Chủ nhà sửa nhà / Làm nội thất',
      tag: 'Chủ nhà sửa nhà',
      pain: 'Bối rối giữa hàng chục loại ván công nghiệp; sợ mua nhầm ván đắt mà vẫn bị ẩm mốc, bung cạnh sau thời gian ngắn.',
      intent: 'Chưa biết chọn ván → Cần tư vấn đúng hạng mục và môi trường trước khi nói giá',
      ctaText: 'Tôi chưa biết chọn ván',
      ctaHref: '/chon-vat-lieu/',
      secondaryHref: '/vat-lieu/',
      needs: 'Nói rõ vị trí (tủ bếp, tủ áo, vách...), môi trường ẩm hay khô, mức ngân sách dự kiến để thu hẹp 1–2 phương án an toàn.'
    }
  ],

  catalogOverview: {
    totalFamilies: 18,
    totalHistoricalVariants: 188,
    liveSiteCatalogCount: 159,
    disclaimer: 'Dữ liệu lưu trữ lịch sử — Không tự ý suy đoán tồn kho hoặc giá bán. Cần đối soát trực tiếp khi liên hệ.',
    featuredFamilies: [
      {
        sku: 'MDF012',
        slug: 'mdf-chong-am',
        name: 'Ván MDF chống ẩm lõi xanh',
        group: 'Ván MDF',
        img: '/catalog-assets/mdf012-1.webp',
        alt: 'Mặt cắt cốt ván MDF chống ẩm lõi xanh sắc nét',
        spec: 'Khổ 1220×2440mm · Cốt xanh chịu ẩm · Nội thất khu vực ẩm',
        badge: 'Chống ẩm cao'
      },
      {
        sku: 'CPH003',
        slug: 'coppha-phim',
        name: 'Ván ép coppha phủ phim Tekcom & Việt Hoa',
        group: 'Coppha',
        img: '/catalog-assets/cph003-1.webp',
        alt: 'Ván ép coppha phủ phim Tekcom cạnh phủ keo chống nước',
        spec: 'Độ dày 12mm / 15mm / 18mm · Phủ phim Dynea · Đổ bê tông',
        badge: 'Chủ lực công trình'
      },
      {
        sku: 'CMB006',
        slug: 'cemboard',
        name: 'Tấm xi măng nhẹ Cemboard (X2 / Shera)',
        group: 'Bê tông nhẹ Cemboard',
        img: '/catalog-assets/cmb006-1.webp',
        alt: 'Kiện tấm xi măng nhẹ Cemboard nguyên đai nguyên kiện',
        spec: 'Độ dày 3.5mm – 20mm · Chống cháy, chịu ẩm · Vách, trần, sàn nhẹ',
        badge: 'Chịu nước & chống cháy'
      },
      {
        sku: 'MDF011',
        slug: 'mdf-chong-am-melamine',
        name: 'Ván MDF chống ẩm phủ Melamine',
        group: 'Ván MDF',
        img: '/catalog-assets/mdf011-1.webp',
        alt: 'Ván MDF chống ẩm phủ Melamine hoa văn vân gỗ cao cấp',
        spec: '53 mã màu vân gỗ / đơn sắc · Cốt HMR lõi xanh · Tủ áo, kệ',
        badge: '53 vân màu'
      },
      {
        sku: 'PLY001',
        slug: 'van-ep-carb-p2',
        name: 'Ván ép Plywood CARB P2',
        group: 'Ván ép / Plywood',
        img: '/catalog-assets/ply001-1.webp',
        alt: 'Ván ép Plywood thớ gỗ lạng liên kết nhiều lớp',
        spec: 'Chuẩn phát thải thấp CARB P2 · Kết cấu nhiều lớp đan chéo',
        badge: 'Chuẩn an toàn'
      },
      {
        sku: 'ALU020',
        slug: 'alu-lion',
        name: 'Tấm nhôm nhựa ALU Lion',
        group: 'Vật liệu quảng cáo & ốp',
        img: '/catalog-assets/alu020-1.webp',
        alt: 'Tấm ốp nhôm nhựa Alu Lion bóng mịn',
        spec: 'Ốp mặt dựng, vách trang trí, biển hiệu nội ngoại thất',
        badge: 'Đa màu sắc'
      }
    ]
  },

  applications: [
    {
      title: 'Tủ bếp & chậu rửa',
      condition: 'Khu vực tiếp xúc ẩm thường xuyên, hơi nước nấu nướng và rò rỉ nước cục bộ.',
      recommendation: 'Cốt ván MDF chống ẩm lõi xanh hoặc ván nhựa PVC khu vực chậu rửa; không dùng MDF thường.',
      href: '/chon-vat-lieu/',
      action: 'Chọn ván tủ bếp',
      img: '/catalog-assets/mdf012-1.webp'
    },
    {
      title: 'Tủ áo & nội thất phòng ngủ',
      condition: 'Không gian khô ráo, ưu tiên thẩm mỹ bề mặt, khả năng gia công cắt mép và kinh tế.',
      recommendation: 'Ván MDF phủ Melamine đa sắc hoặc Plywood dán veneer; tối ưu chi phí gia công.',
      href: '/chon-vat-lieu/',
      action: 'Chọn ván nội thất',
      img: '/catalog-assets/mdf011-1.webp'
    },
    {
      title: 'Vách ngăn & trần trang trí',
      condition: 'Cần phẳng, nhẹ, liên kết khung xương chắc chắn và chịu va đập theo thiết kế.',
      recommendation: 'MDF tiêu chuẩn cho vách khô hoặc Cemboard mỏng 4.5–6mm cho khu vực cần chịu ẩm.',
      href: '/chon-vat-lieu/',
      action: 'Chọn ván làm vách',
      img: '/catalog-assets/cmb006-1.webp'
    },
    {
      title: 'Sàn gác & tấm lót sàn',
      condition: 'Hạng mục chịu tải trực tiếp. Phải kiểm tra khẩu độ đà đỡ, bước xương và tải trọng.',
      recommendation: 'Không chọn tấm chỉ theo độ dày. Phải kiểm tải, nhịp, hệ khung và thiết kế.',
      href: '/bao-gia/?muc-dich=san-gac',
      action: 'Gửi điều kiện để tư vấn',
      img: '/catalog-assets/cmb006-3.webp'
    },
    {
      title: 'Khu vực ẩm hoặc có nước',
      condition: 'Phân biệt rõ: hơi ẩm không khí, nước tạt định kỳ hay ngâm nước liên tục.',
      recommendation: 'Ván chống ẩm chịu được độ ẩm không khí cao; tiếp xúc nước ngâm cần tấm gốc xi măng hoặc nhựa PVC.',
      href: '/chon-vat-lieu/',
      action: 'Tìm hướng phù hợp',
      img: '/catalog-assets/pvc015-1.webp'
    },
    {
      title: 'Ngoài trời / khu vực nắng mưa',
      condition: 'Tác động trực tiếp của tia UV, nhiệt độ cao và chu kỳ mưa ướt liên tục.',
      recommendation: 'Cần đối chiếu thông số từng sản phẩm và điều kiện thi công thực tế; không dùng ván nội thất.',
      href: '/bao-gia/?muc-dich=ngoai-troi',
      action: 'Hỏi về điều kiện ngoài trời',
      img: '/catalog-assets/cph003-1.webp'
    }
  ],

  threeLearnings: [
    {
      num: '01',
      title: 'Chống ẩm không đồng nghĩa chịu nước',
      summary: 'Ván chống ẩm (lõi xanh) có chất phụ gia giảm trương nở trong không khí ẩm, nhưng không thể ngâm nước liên tục. Nơi có nước đọng cần giải pháp vật liệu tấm chuyên biệt.',
      href: '/cam-nang/#chong-am',
      tag: 'Khái niệm cốt lõi'
    },
    {
      num: '02',
      title: 'Cùng tên ván chưa chắc cùng chất lượng',
      summary: 'Cốt, bề mặt, độ dày và nhà sản xuất khác nhau có thể dẫn đến giá và phạm vi sử dụng khác nhau. So sánh giá chỉ có ý nghĩa khi đặt trên cùng quy cách kỹ thuật.',
      href: '/cam-nang/#so-quy-cach',
      tag: 'So sánh quy cách'
    },
    {
      num: '03',
      title: 'Tấm ván tốt không thay thế được kết cấu đúng',
      summary: 'Với sàn gác hoặc hạng mục chịu tải, phải xét cả hệ kết cấu chứ không chỉ riêng độ dày. Khoảng cách đà đỡ và cách bắt vít quyết định độ võng và độ an toàn.',
      href: '/cam-nang/#ket-cau',
      tag: 'Kỹ thuật thi công'
    }
  ],

  processSteps: [
    {
      step: '01',
      title: 'Nói việc cần làm',
      detail: 'Hạng mục cụ thể (tủ bếp, vách, sàn, cốp pha), vị trí thi công và thời điểm cần vật liệu.'
    },
    {
      step: '02',
      title: 'Làm rõ điều kiện',
      detail: 'Môi trường ẩm hay khô, mức độ chịu tải, hệ xương đỡ, tuổi thọ mong muốn và ngân sách dự kiến.'
    },
    {
      step: '03',
      title: 'So sánh phương án',
      detail: 'Giải thích ưu điểm, giới hạn kỹ thuật và điều kiện bảo hành của 1–2 phương án vật liệu tối ưu.'
    },
    {
      step: '04',
      title: 'Kiểm giá và tình trạng hàng',
      detail: 'Xác định mã hàng, độ dày, số lượng rồi kiểm giá kho hiện hành và phương án giao nhận thực tế.'
    }
  ],

  whyChooseUs: [
    {
      title: 'Hỏi đúng việc trước khi bán',
      desc: 'Một tủ bếp và một hệ sàn gác không thể được tư vấn như nhau. Hà Vy hỏi kỹ mục đích sử dụng để không đề xuất nhầm.'
    },
    {
      title: 'Nói rõ điều nên và không nên dùng',
      desc: 'Không có vật liệu nào hoàn hảo cho mọi vị trí. Chúng tôi nêu rõ giới hạn vật liệu để tránh sự cố hư hỏng sau thi công.'
    },
    {
      title: 'So giá trên cùng quy cách',
      desc: 'Làm rõ cốt ván, thương hiệu, tỷ trọng, độ dày và bề mặt phủ trước khi báo giá. Không mập mờ phẩm cấp.'
    },
    {
      title: 'Không hứa khi chưa kiểm tra',
      desc: 'Giá, số lượng hàng sẵn và lịch giao nhận phải được kiểm chứng tại kho Quy Nhơn trước khi xác nhận đơn.'
    }
  ],

  faqList: [
    {
      q: 'Hà Vy có báo giá ngay không?',
      a: 'Khi có tên hàng hoặc quy cách, số lượng và điều kiện giao nhận, Hà Vy có thể kiểm giá tại thời điểm tư vấn. Nếu chưa rõ sẽ hỏi thêm để tránh so nhầm.'
    },
    {
      q: 'Chỉ có hình ảnh, không biết tên ván, có hỏi được không?',
      a: 'Được. Anh/chị hãy gửi ảnh qua Zalo, kèm mục đích sử dụng để cùng làm rõ thông tin cần thiết.'
    },
    {
      q: 'Ván chống ẩm có chịu nước không?',
      a: 'Không nên đánh đồng. Cần phân biệt ẩm môi trường, nước tạt và tiếp xúc nước thường xuyên, đồng thời xem thông số mã hàng.'
    },
    {
      q: 'Làm tủ bếp có cần ván đắt nhất không?',
      a: 'Không nhất thiết. Các vị trí sử dụng có yêu cầu khác nhau, cần so tuổi thọ kỳ vọng và ngân sách.'
    },
    {
      q: 'Giá và tồn kho trên website có cập nhật theo thời gian thực?',
      a: 'Không. Giá và tình trạng hàng chỉ được xác nhận khi liên hệ tại thời điểm trao đổi.'
    },
    {
      q: 'Tôi cần gửi gì để được kiểm giá nhanh?',
      a: 'Tên hoặc mã hàng, cốt, bề mặt, độ dày, kích thước, số lượng và nơi nhận; có thể bổ sung phần thiếu sau.'
    },
    {
      q: 'Hà Vy có nhận thiết kế hoặc thi công không?',
      a: 'Hà Vy kinh doanh và tư vấn lựa chọn vật liệu, không thay thế đơn vị thiết kế, thi công hoặc chuyên gia tính toán kết cấu.'
    }
  ]
});
