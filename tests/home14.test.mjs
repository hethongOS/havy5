import test from 'node:test';
import assert from 'node:assert/strict';
import { render, routes } from '../src/site.mjs';
import { homepageSections } from '../src/home14.mjs';

test('homepage has all 14 requested semantic sections in order', () => {
  const html = render('/');
  assert.equal(homepageSections.length, 14);
  let last = -1;
  for(const id of homepageSections) {
    const marker = `id="section-${id}"`;
    const found=html.indexOf(marker);
    assert.ok(found>last, `Missing or out of order section ${id}`);
    last=found;
  }
  assert.match(html,/Chọn đúng ván/);
  assert.match(html,/Tôi đã có quy cách/);
  assert.match(html,/Melamine là bề mặt phủ/);
});

test('customer journeys have functional route destinations and honest disclaimers', () => {
  const home=render('/');
  const routesSet=new Set(routes);
  for(const match of home.matchAll(/href="(\/[^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (['/favicon.svg','/styles.css','/home14.css'].includes(target)) continue;
    assert.ok(routesSet.has(target), `Broken route: ${target}`);
  }
  assert.match(home,/chưa có tính năng tự tính số tấm/);
  assert.match(home,/Đang bổ sung ảnh kho đã xác minh/);
  assert.match(home,/không phải lời chứng thực/);
  assert.doesNotMatch(home,/52 Tăng Bạt Hổ/);
  assert.match(render('/vat-lieu/'),/id="phu-melamine"/);
});

test('guide links all resolve to real article sections',()=>{
  const guide=render('/cam-nang/');
  for(const anchor of ['chong-am','so-quy-cach','ket-cau','nguon-hang','chu-bi']) {
    assert.match(guide,new RegExp(`id="${anchor}"`));
  }
  assert.match(guide,/không phải hồ sơ kiểm nghiệm/);
});

test('conversion CTAs are measurable without sending personal data',()=>{
  const home=render('/');
  assert.match(home,/data-track="start_advisor"/);
  assert.match(home,/data-track="request_quote"/);
});
