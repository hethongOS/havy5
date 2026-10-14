import test from 'node:test';
import assert from 'node:assert/strict';
import { advise, answers } from '../src/advisor.mjs';
import { render, routes } from '../src/site.mjs';
const base = { use:'noi-that',moisture:'kho',priority:'tham-my',budget:'can-bang' };
test('every route renders a Vietnamese page and noindex on LAB',()=>{
  assert.equal(routes.length,9);
  for(const path of routes){const html=render(path);assert.match(html, /lang="vi"/);assert.match(html, /noindex,nofollow/);assert.match(html,/main id="main"/);}
});
test('dry furniture defaults to appropriate MDF comparison',()=>{assert.equal(advise(base).slug,'mdf');});
test('moisture triggers caution instead of regular MDF',()=>{const result=advise({...base,moisture:'am'});assert.notEqual(result.slug,'mdf');assert.match(result.caveat,/không đồng nghĩa|Không/);});
test('external use requires system-level review',()=>{assert.equal(advise({...base,moisture:'ngoai-troi'}).slug,'cemboard');});
test('structural / flooring use always alerts structural verification',()=>{const v=advise({...base,use:'san-ngoai'});assert.equal(v.slug,'cemboard');assert.match(v.caveat,/kết cấu/);});
test('durability in dry area can prefer plywood',()=>{assert.equal(advise({...base,priority:'do-ben'}).slug,'plywood');});
test('invalid answer input rejected',()=>{assert.throws(()=>advise({...base,moisture:'INVALID'}),TypeError);assert.throws(()=>advise({}),TypeError);});
test('legacy wrong address not present',()=>{for(const path of routes){assert.doesNotMatch(render(path),/52 Tăng Bạt Hổ/);}});
test('site never advertises false CRM submissions',()=>{assert.match(render('/bao-gia/'),/Chưa gửi tự động/);});
test('all 108 combinations return supported category and caveat',()=>{
  let count=0;
  for(const use of answers.use) for(const moisture of answers.moisture) for(const priority of answers.priority) for(const budget of answers.budget){
    const x=advise({use,moisture,priority,budget});assert.ok(['mdf','plywood','cemboard'].includes(x.slug));assert.ok(x.caveat.length>15);count++;
  }
  assert.equal(count,108);
});

test('direct contact is available without CRM or Gemini API',()=>{assert.match(render('/bao-gia/'),/tel:0983062897/);assert.match(render('/bao-gia/'),/zalo\.me\/0983062897/);});

test('quote can be composed locally then sent by user on Zalo',()=>{const html=render('/bao-gia/');assert.match(html,/id="quoteOutput" hidden/);assert.match(html,/Sao chép nội dung/);assert.match(html,/tự bấm gửi|tự gửi/);});
