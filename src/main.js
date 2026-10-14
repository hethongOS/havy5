import { advise } from './advisor.mjs';

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
      body.innerHTML = `<div class="wizard-result-tag">✓ ${escapeHtml(result.confidence)}</div><h2 style="margin-top:23px">Phương án đáng cân nhắc</h2><div class="result-material">${escapeHtml(result.material)}</div><p class="result-copy">${escapeHtml(result.description)}</p><ul class="result-reasons">${result.reasons.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><div class="result-caveat"><strong>Cần lưu ý:</strong> ${escapeHtml(result.caveat)}</div><p class="wizard-prompt">Đây là hướng tham khảo, không phải kết luận kỹ thuật hay báo giá.</p><div class="result-actions"><a class="btn btn-primary" href="/vat-lieu/${slug}/">Xem nhóm vật liệu →</a><a class="btn btn-ghost" href="/bao-gia/?vat-lieu=${slug}">Hỏi Hà Vy về hạng mục →</a></div><button type="button" class="wizard-prev" id="wizardReset">↻ Trả lời lại từ đầu</button>`;
      body.querySelector('#wizardReset').addEventListener('click', () => { step = 0; Object.keys(state).forEach(k=>delete state[k]); render(); });
      return;
    }
    const question = questions[step];
    body.innerHTML = `<h2 id="question-title" tabindex="-1">${escapeHtml(question.title)}</h2><p class="wizard-prompt">${escapeHtml(question.hint)}</p><div class="choice-list" role="group" aria-labelledby="question-title">${question.choices.map(([value,label])=>`<button type="button" class="choice" data-value="${value}" aria-pressed="${String(state[question.key]===value)}"><span class="choice-indicator" aria-hidden="true"></span>${escapeHtml(label)}</button>`).join('')}</div><div class="wizard-actions"><button class="wizard-prev" id="wizardPrev" type="button" ${step===0?'disabled':''}>← Quay lại</button><button class="btn btn-primary wizard-next" id="wizardNext" type="button" ${!state[question.key]?'disabled':''}>${step===3?'Xem kết quả':'Tiếp tục →'}</button></div>`;
    body.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
      state[question.key] = btn.dataset.value;
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
  form.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.querySelector('#formMessage');
    const project = form.elements.project.value;
    const desc = form.elements.description.value.trim();
    const consent = form.elements.consent.checked;
    if (!project || desc.length < 10 || !consent) {
      status.className='form-message error';
      status.textContent='Vui lòng chọn hạng mục, mô tả ít nhất 10 ký tự và xác nhận đây là bản LAB.';
      return;
    }
    status.className='form-message ok';
    status.textContent='✓ Nội dung thử nghiệm hợp lệ. Chưa gửi yêu cầu đến Hà Vy và không lưu dữ liệu lên máy chủ.';
  });
}
initNav();initFilters();initWizard();initQuote();
