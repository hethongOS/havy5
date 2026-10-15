import { readFileSync } from 'node:fs';

const archive = JSON.parse(readFileSync(new URL('./catalog-data.json',import.meta.url),'utf8'));
const families = archive.families;
const variants = families.flatMap(f=>f.variants.map(v=>({...v,family:f})));
const byFamily = new Map(families.map(f=>[f.slug,f]));
const bySku = new Map(variants.map(v=>[v.slug,v]));
const catalogPaths = [
 '/san-pham/',
 ...families.map(f=>'/san-pham/'+encodeURIComponent(f.slug)+'/'),
 ...variants.map(v=>'/ma-hang/'+encodeURIComponent(v.slug)+'/')
];
const esc = input=>String(input??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;', '>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const note = `<div class="legacy-note" role="note"><strong>Thông tin từ hồ sơ lưu trữ.</strong> Mã hàng, thương hiệu, quy cách cần kiểm tra lại trước khi mua. <b>Không có giá, tồn kho hoặc chứng nhận kỹ thuật đã xác minh theo thời gian thực.</b> Vui lòng liên hệ Hà Vy.</div>`;
const image = (f,idx=0,kind='card') => {
 const src=f.gallery[idx]||'';
 return src?`<img class="legacy-image legacy-image-${kind}" src="${esc(src)}" alt="Ảnh tư liệu: ${esc(f.title)}" loading="${kind==='hero'?'eager':'lazy'}" width="850" height="620"/>`:
 `<div class="legacy-image legacy-empty" role="img" aria-label="Dòng hàng chưa có ảnh được xác minh"><span>${esc(f.group||'Vật liệu')}</span><strong>Ảnh đang đối chiếu</strong></div>`;
};
const breadcrumb=parts=>`<nav class="legacy-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>›</span><a href="/san-pham/">Sản phẩm</a>${parts.map(({label,url})=>`<span>›</span>${url?`<a href="${url}">${esc(label)}</a>`:`<span aria-current="page">${esc(label)}</span>`}`).join('')}</nav>`;
const wrapper=(header,footer,inner)=>`${header('materials')}<main id="main" class="legacy-catalog"><div class="wrap">${inner}</div></main>${footer()}`;
const familyURL=f=>'/san-pham/'+encodeURIComponent(f.slug)+'/';
const variantURL=v=>'/ma-hang/'+encodeURIComponent(v.slug)+'/';
const photoLabel='Ảnh tư liệu từ kho lưu trữ Hà Vy. Ảnh cần được kiểm tra lại để xác định đúng quy cách và nhà sản xuất.';
const textCell=value=>value?esc(value):'<span class="legacy-unknown">Chưa xác minh</span>';
function familyTile(f){
 return `<article class="legacy-family" data-catalog-item data-group="${esc(f.group)}" data-search="${esc([f.title,f.sku,f.group,...f.variants.map(v=>v.sku)].join(' ').toLowerCase())}"><a href="${familyURL(f)}" class="legacy-thumb">${image(f)}</a><div class="legacy-tile-content"><span class="legacy-type">${esc(f.group||'Vật liệu tấm')}</span><h2><a href="${familyURL(f)}">${esc(f.title)}</a></h2><p>${f.variants.length} mã biến thể trong hồ sơ · <strong>${esc(f.sku)}</strong></p><a class="legacy-card-link" href="${familyURL(f)}">Xem ảnh, quy cách và lưu ý <span aria-hidden="true">→</span></a></div></article>`;
}
function renderCatalog({header,footer}){
 const groups=[...new Set(families.map(f=>f.group).filter(Boolean))];
 return wrapper(header,footer,`${breadcrumb([])}
 <header class="legacy-lead"><span class="legacy-overline">DANH MỤC KHÔI PHỤC · HÀ VY QUY NHƠN</span>
 <h1>Tìm đúng dòng ván.<br/><em>Kiểm đúng mã hàng.</em></h1>
 <p>Duyệt các nhóm vật liệu, xem hình ảnh lưu trữ và tìm mã SKU từng quy cách. Chọn hàng theo công năng, môi trường sử dụng và thông tin hiện hành, không chỉ theo tên gọi.</p>
 <div class="legacy-overview"><span><strong>${families.length}</strong> dòng vật liệu</span><span><strong>${variants.length}</strong> mã lịch sử</span><span><strong>${families.filter(f=>f.image).length}</strong> dòng có ảnh lưu trữ</span></div></header>
 ${note}<section class="legacy-tools" aria-label="Tìm và lọc sản phẩm"><div><label for="legacyQuery">Tìm theo tên, nhóm, mã SKU</label><input id="legacyQuery" type="search" placeholder="Ví dụ: MDF, Cemboard, CMB006..." autocomplete="off"/></div><div class="legacy-filter-wrap"><label for="legacyGroup">Nhóm vật liệu</label><select id="legacyGroup"><option value="">Tất cả nhóm hàng</option>${groups.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('')}</select></div><p class="legacy-results" id="legacyResults" role="status">${families.length} dòng vật liệu</p></section>
 <div class="legacy-family-grid" id="legacyGrid">${families.map(familyTile).join('')}</div>
 <p class="legacy-none" id="legacyNoResults" hidden>Không tìm thấy nhóm phù hợp. Anh/chị thử tìm theo công năng hoặc <a href="/chon-vat-lieu/">chọn theo hạng mục</a>.</p>
 <section class="legacy-assist"><div><h2>Chưa biết nên chọn mã nào?</h2><p>Hãy mô tả hạng mục và điều kiện sử dụng để được gợi ý hướng phù hợp trước khi hỏi giá.</p></div><a class="btn btn-primary" href="/chon-vat-lieu/" data-track="start_advisor">Chọn theo hạng mục →</a></section>`);
}
function variantRow(v) {
 return `<tr><td><a href="${variantURL(v)}"><strong>${esc(v.sku)}</strong><small>${esc(v.label||'Chi tiết mã hàng')}</small></a></td><td>${textCell(v.brand)}</td><td>${textCell(v.thickness)}</td><td>${textCell(v.dimensions)}</td><td><a href="${variantURL(v)}">Xem chi tiết →</a></td></tr>`;
}
function renderFamily(slug,{header,footer}){
 const f=byFamily.get(slug);if(!f)return null;
 const gallery=f.gallery.length?`<div class="legacy-mini-gallery">${f.gallery.slice(1).map((_,i)=>`<button class="legacy-photo-button" type="button" data-photo="${esc(f.gallery[i+1])}" aria-label="Xem hình ${i+2} của ${esc(f.title)}">${image(f,i+1)}</button>`).join('')}</div>`:'';
 return wrapper(header,footer,`${breadcrumb([{label:f.title}])}
 <section class="legacy-detail-head"><div class="legacy-detail-images"><div class="legacy-main-photo" id="legacyMainPhoto">${image(f,0,'hero')}</div>${gallery}<p class="legacy-photo-caption">${photoLabel}</p></div>
 <div class="legacy-detail-copy"><span class="legacy-overline">${esc(f.group)}</span><h1>${esc(f.title)}</h1><p class="legacy-sku">Dòng lưu trữ: <strong>${esc(f.sku)}</strong></p><p>Hồ sơ lịch sử của Hà Vy có <strong>${f.variants.length} biến thể</strong> thuộc dòng hàng này. Đối chiếu độ dày, kích thước và tình huống sử dụng trước khi kiểm giá.</p>
 <div class="legacy-detail-actions"><a class="btn btn-primary" href="#bang-quy-cach">Xem quy cách →</a><a class="btn btn-ghost" href="/bao-gia/?muc-dich=kiem-gia&ma-hang=${encodeURIComponent(f.sku)}">Hỏi giá hiện hành</a></div>
 <div class="legacy-spec-list"><div><strong>Chọn theo công năng</strong><span>Điều kiện ẩm, tải trọng, lớp phủ và hệ thi công phải được làm rõ trước khi mua.</span></div><div><strong>Giá và tồn kho</strong><span>Không dùng thông tin từ hồ sơ cũ. Liên hệ Hà Vy để xác nhận hiện hành.</span></div></div></div></section>
 ${note}<section class="legacy-variants" id="bang-quy-cach"><div class="legacy-section-heading"><div><span class="legacy-overline">SKU / QUY CÁCH LƯU TRỮ</span><h2>Danh sách biến thể</h2></div><span>${f.variants.length} mã</span></div>
 <div class="legacy-table-wrap"><table><thead><tr><th>Mã SKU / Biến thể</th><th>Thương hiệu trong hồ sơ</th><th>Độ dày</th><th>Quy cách</th><th>Hành động</th></tr></thead><tbody>${f.variants.map(variantRow).join('')}</tbody></table></div><p class="legacy-table-foot">Dữ liệu kỹ thuật từ hồ sơ lưu trữ, chưa đối chiếu datasheet từng mã; không dùng riêng bảng này để quyết định hạng mục chịu lực/kết cấu.</p></section>
 <section class="legacy-assist"><div><h2>Đã có mã hàng cần kiểm giá?</h2><p>Gửi mã SKU, số lượng và nơi nhận để Hà Vy kiểm tra hàng phù hợp đang kinh doanh.</p></div><a class="btn btn-primary" href="/bao-gia/?muc-dich=kiem-gia&ma-hang=${encodeURIComponent(f.sku)}">Chuẩn bị yêu cầu →</a></section>`);
}
function renderSku(slug,{header,footer}){
 const v=bySku.get(slug);if(!v)return null;const f=v.family;
 return wrapper(header,footer,`${breadcrumb([{label:f.title,url:familyURL(f)},{label:v.sku}])}
 <section class="legacy-detail-head"><div class="legacy-detail-images"><div class="legacy-main-photo">${image(f,0,'hero')}</div><p class="legacy-photo-caption">Ảnh của dòng sản phẩm, chưa chắc là ảnh đúng biến thể ${esc(v.sku)}.</p></div>
 <div class="legacy-detail-copy"><span class="legacy-overline">MÃ HÀNG LƯU TRỮ · ${esc(f.group)}</span><h1>${esc(f.title)}</h1><p class="legacy-variant-name">${esc(v.label||v.sku)}</p><div class="legacy-sku-banner">Mã SKU <strong>${esc(v.sku)}</strong><button type="button" data-copy-sku="${esc(v.sku)}">Sao chép mã</button></div>
 <dl class="legacy-facts"><div><dt>Thương hiệu theo hồ sơ</dt><dd>${textCell(v.brand)}</dd></div><div><dt>Độ dày ghi nhận</dt><dd>${textCell(v.thickness)}</dd></div><div><dt>Kích thước ghi nhận</dt><dd>${textCell(v.dimensions)}</dd></div><div><dt>Giá/tồn kho hiện hành</dt><dd>Liên hệ xác nhận</dd></div></dl>
 <div class="legacy-detail-actions"><a class="btn btn-primary" href="/bao-gia/?muc-dich=kiem-gia&ma-hang=${encodeURIComponent(v.sku)}">Kiểm giá đúng quy cách →</a><a class="btn btn-ghost" href="${familyURL(f)}">Về dòng sản phẩm</a></div></div></section>${note}
 <section class="legacy-assist"><div><h2>Không chọn ván chỉ theo độ dày</h2><p>Với công năng, chống ẩm hoặc kết cấu, cần xác minh datasheet và điều kiện thi công cụ thể.</p></div><a class="btn btn-primary" href="/chon-vat-lieu/">Tư vấn vật liệu →</a></section>`);
}
function getCatalogMeta(path){
 if(path==='/san-pham/')return {title:'Danh mục sản phẩm và mã ván',description:'Tìm các dòng vật liệu Hà Vy, mã và quy cách lưu trữ; kiểm tra giá và tồn kho trước khi mua.'};
 let m=/^\/san-pham\/([^/]+)\/$/.exec(path);
 if(m){const f=byFamily.get(decodeURIComponent(m[1]));return f?{title:f.title,description:'Các mã và quy cách lưu trữ của '+f.title+'. Liên hệ Hà Vy để xác nhận thông tin hiện hành.'}:null;}
 m=/^\/ma-hang\/([^/]+)\/$/.exec(path);
 if(m){const v=bySku.get(decodeURIComponent(m[1]));return v?{title:'Mã '+v.sku+' — '+v.family.title,description:'Thông số lịch sử mã '+v.sku+'. Liên hệ Hà Vy xác nhận giá, tồn kho và thông số kỹ thuật.'}:null;}
 return null;
}
function renderLegacy(path,{header,footer}){
 if(path==='/san-pham/')return renderCatalog({header,footer});
 let m=/^\/san-pham\/([^/]+)\/$/.exec(path);
 if(m)return renderFamily(decodeURIComponent(m[1]),{header,footer});
 m=/^\/ma-hang\/([^/]+)\/$/.exec(path);
 if(m)return renderSku(decodeURIComponent(m[1]),{header,footer});
 return null;
}

export {families,variants,catalogPaths,renderLegacy,getCatalogMeta};
