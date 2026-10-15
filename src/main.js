import { createAdvisorHandoff, readAdvisorHandoff, formatAdvisorHandoff } from './handoff.mjs';
import { advise } from './advisor.mjs';

// Hooks đo lường nội bộ: chỉ gửi sự kiện trong trình duyệt, không lưu PII hay gửi máy chủ.
function emitEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent('havy:analytics', { detail: { name, page: location.pathname, ...detail } }));
}
function initTracking() {
  emitEvent('page_view');
  document.addEventListener('click', event => {
    const tracked = event.target.closest('[data-track]');
    if (tracked) emitEvent(tracked.dataset.track);
  });
}

function initNav() {
  const toggle = document.querySelector('#navToggle');
  const nav = document.querySelector('#mobileNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Đóng menu' : 'Mở menu');
    nav.hidden = !opening;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !nav.hidden) { nav.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
}
function initFilters() {
  const group = document.querySelector('#filters');
  if (!group) return;
  group.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const value = btn.dataset.filter;
    emitEvent('catalogue_filter', { filter: value });
    group.querySelectorAll('[data-filter]').forEach(node => {
      node.classList.toggle('active', node === btn);
      node.setAttribute('aria-pressed', String(node === btn));
    });
    document.querySelectorAll('.filterable').forEach(card => { card.hidden = !(value === 'all' || card.dataset.kind === value); });
  });
}
const questions = [
  { key: 'use', title: 'Anh/chị đang làm hạng mục nào?', hint: 'Chọn mục đích sử dụng gần nhất.', choices: [['noi-that','Tủ áo / nội thất phòng'],['tu-ke','Tủ bếp / kệ / hệ tủ'],['vach-tran','Vách ngăn / trần'],['san-ngoai','Sàn / kết cấu / ngoài trời']] },
  { key: 'moisture', title: 'Môi trường sử dụng ra sao?', hint: 'Độ ẩm thay đổi nhiều cách lựa chọn.', choices: [['kho','Trong nhà, khô ráo'],['am','Khu vực có nguy cơ ẩm'],['ngoai-troi','Ngoài trời, có thời tiết tác động']] },
  { key: 'priority', title: 'Anh/chị ưu tiên điều gì?', hint: 'Chọn điều quan trọng nhất với công trình.', choices: [['tham-my','Thẩm mỹ, bề mặt đẹp'],['do-ben','Độ bền, liên kết, kết cấu'],['tiet-kiem','Tối ưu chi phí']] },
  { key: 'budget', title: 'Ngân sách dự kiến thuộc mức nào?', hint: 'Đây không phải mức giá sản phẩm.', choices: [['tiet-kiem','Tiết kiệm'],['can-bang','Cân bằng chi phí / nhu cầu'],['dau-tu','Đầu tư lâu dài']] }
];
const escapeHtml = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function initWizard() {
  const wizard = document.querySelector('#wizard');
  if (!wizard) return;
  const body = document.querySelector('#wizard-body');
  const count = document.querySelector('#wizard-count');
  const progress = document.querySelector('#wizard-progress');
  let step = 0;
  const state = {};
  function render() {
    const done = step === questions.length;
    count.textContent = done ? 'HOÀN TẤT / 4' : `CÂU ${step + 1} / 4`;
    progress.style.width = `${done ? 100 : (step + 1) / 4 * 100}%`;
    if (done) {
      let result;
      try { result = advise(state); } catch { step = 0; render(); return; }
      const slug = encodeURIComponent(result.slug);
      const handoffUrl = createAdvisorHandoff(state);
      emitEvent('advisor_complete', { material: result.slug });
      body.innerHTML = `<div class="wizard-result-tag">✓ ${escapeHtml(result.confidence)}</div><h2 style="margin-top:23px">Phương án đáng cân nhắc</h2><div class="result-material">${escapeHtml(result.material)}</div><p class="result-copy">${escapeHtml(result.description)}</p><ul class="result-reasons">${result.reasons.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><div class="result-caveat"><strong>Cần lưu ý:</strong> ${escapeHtml(result.caveat)}</div><p class="wizard-prompt">Đây là hướng tham khảo, không phải kết luận kỹ thuật hay báo giá.</p><div class="result-actions"><a class="btn btn-primary" href="/vat-lieu/${slug}/">Xem nhóm vật liệu →</a><a class="btn btn-ghost" href="${escapeHtml(handoffUrl)}">Hỏi Hà Vy về hạng mục →</a></div><button type="button" class="wizard-prev" id="wizardReset">↻ Trả lời lại từ đầu</button>`;
      body.querySelector('#wizardReset').addEventListener('click', () => { step = 0; Object.keys(state).forEach(k=>delete state[k]); render(); });
      return;
    }
    const question = questions[step];
    body.innerHTML = `<h2 id="question-title" tabindex="-1">${escapeHtml(question.title)}</h2><p class="wizard-prompt">${escapeHtml(question.hint)}</p><div class="choice-list" role="group" aria-labelledby="question-title">${question.choices.map(([value,label])=>`<button type="button" class="choice" data-value="${value}" aria-pressed="${String(state[question.key]===value)}"><span class="choice-indicator" aria-hidden="true"></span>${escapeHtml(label)}</button>`).join('')}</div><div class="wizard-actions"><button class="wizard-prev" id="wizardPrev" type="button" ${step===0?'disabled':''}>← Quay lại</button><button class="btn btn-primary wizard-next" id="wizardNext" type="button" ${!state[question.key]?'disabled':''}>${step===3?'Xem kết quả':'Tiếp tục →'}</button></div>`;
    body.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
      state[question.key] = btn.dataset.value;
      emitEvent('advisor_answer', { question: question.key });
      body.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
      body.querySelector('#wizardNext').disabled=false;
    }));
    body.querySelector('#wizardNext').addEventListener('click',()=>{if(!state[question.key])return;step++;render();body.querySelector('h2')?.focus();});
    body.querySelector('#wizardPrev').addEventListener('click',()=>{step=Math.max(0,step-1);render();body.querySelector('h2')?.focus();});
  }
  render();
}
function initQuote() {
  const form = document.querySelector('#quoteForm');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const param = params.get('vat-lieu');
  if (['mdf','plywood','cemboard'].includes(param)) form.elements.material.value = param;
  // Predefined, non-personal query parameters from homepage CTAs.
  const purposes = {
    'kiem-gia': ['khac', 'Tôi đã có quy cách, cần Hà Vy kiểm giá và tình trạng hàng. Mã hàng / độ dày / kích thước / số lượng / địa điểm nhận: '],
    'du-toan': ['khac', 'Tôi cần chuẩn bị dự toán cho công trình. Hạng mục / kích thước / chủng loại / tiến độ: '],
    'san-gac': ['san-ngoai', 'Tôi muốn hỏi vật liệu cho sàn gác. Cần xem tải trọng thiết kế, hệ khung, nhịp, liên kết và tài liệu của đúng mã tấm. Thông tin đang có: '],
    'ngoai-troi': ['san-ngoai', 'Tôi muốn hỏi vật liệu sử dụng ngoài trời. Vị trí, mức tiếp xúc nước/nắng, điều kiện thi công và thông tin đang có: '],
    'melamine': ['noi-that', 'Tôi muốn hỏi về ván có bề mặt phủ Melamine. Loại cốt / mã màu / độ dày / số lượng / nơi sử dụng: ']
  };
  const purpose = purposes[params.get('muc-dich')];
  if (purpose) {
    form.elements.project.value = purpose[0];
    form.elements.description.value = purpose[1];
    emitEvent('quote_purpose_prefilled', { purpose: params.get('muc-dich') });
  }
  const handoff = readAdvisorHandoff(params);
  if (handoff) {
    const summary = document.querySelector('#handoffSummary');
    form.elements.project.value = handoff.input.use;
    form.elements.material.value = handoff.material;
    const details = formatAdvisorHandoff(handoff.input);
    form.elements.description.value = `Tôi đã trả lời bộ chọn vật liệu:\n${details}\nXin tư vấn thêm về chủng loại, quy cách và giá phù hợp.`;
    if (summary) {
      summary.hidden = false;
      summary.textContent = '✓ Đã giữ lại 4 câu trả lời từ công cụ chọn vật liệu. Anh/chị có thể sửa mô tả trước khi gửi qua Zalo.';
    }
    emitEvent('advisor_handoff_loaded', { material: handoff.material });
  }
  const importedSku = params.get('ma-hang');
  if (importedSku && /^[\p{L}\p{N}_.()\-]{2,48}$/u.test(importedSku)) {
    const skuInfo = 'Mã hàng từ danh mục lưu trữ: ' + importedSku + '. Cần Hà Vy đối chiếu mã đang bán, quy cách, giá và tồn kho hiện hành.';
    form.elements.description.value = skuInfo + '\n' + form.elements.description.value;
    if (!form.elements.project.value) form.elements.project.value = 'khac';
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.querySelector('#formMessage');
    const project = form.elements.project.value;
    const desc = form.elements.description.value.trim();
    const consent = form.elements.consent.checked;
    if (!project || desc.length < 10 || !consent) {
      status.className='form-message error';
      status.textContent='Vui lòng chọn hạng mục, mô tả ít nhất 10 ký tự và xác nhận đây là bản LAB.';
      (!project ? form.elements.project : desc.length < 10 ? form.elements.description : form.elements.consent).focus();
      return;
    }
    const labels = { 'noi-that':'Tủ / nội thất','tu-ke':'Kệ / tủ bếp','vach-tran':'Vách / trần','san-ngoai':'Sàn / ngoài trời','khac':'Khác' };
    const materials = { mdf:'MDF', plywood:'Plywood', cemboard:'Cemboard' };
    const message = [
      'Chào Kho Ván Hà Vy, tôi muốn được tư vấn vật liệu:',
      `- Hạng mục: ${labels[project] || 'Chưa rõ'}`,
      `- Vật liệu đang cân nhắc: ${materials[form.elements.material.value] || 'Cần tư vấn'}`,
      `- Nhu cầu: ${desc}`,
      'Xin Hà Vy tư vấn phương án phù hợp và thông tin cần bổ sung để nhận báo giá.'
    ].join('\n');
    const output = document.querySelector('#quoteOutput');
    const field = document.querySelector('#generatedMessage');
    field.value = message;
    output.hidden = false;
    emitEvent('quote_message_prepared');
    status.className='form-message ok';
    status.textContent='✓ Đã soạn xong. Vui lòng sao chép, mở Zalo và tự bấm gửi.';
    document.querySelector('#copyStatus').textContent='';
    output.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });
  document.querySelector('#copyMessage')?.addEventListener('click', async () => {
    const field = document.querySelector('#generatedMessage');
    const note = document.querySelector('#copyStatus');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      note.textContent = '✓ Đã sao chép. Hãy mở Zalo và dán tin nhắn.';
      emitEvent('quote_message_copied');
    } catch {
      field.focus();field.select();
      note.textContent='Trình duyệt không cho sao chép tự động. Nội dung đã được chọn; hãy sao chép thủ công rồi dán vào Zalo.';
    }
  });
}
initTracking();initNav();initFilters();initWizard();initQuote();
