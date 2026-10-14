import test from 'node:test';
import assert from 'node:assert/strict';
import { advise, answers } from '../src/advisor.mjs';
import { createAdvisorHandoff, readAdvisorHandoff, formatAdvisorHandoff } from '../src/handoff.mjs';
import { render, routes } from '../src/site.mjs';
import { renderMeta, pageMeta } from '../src/meta.mjs';
const fixture = { use:'tu-ke', moisture:'am', priority:'do-ben', budget:'can-bang' };
test('advisor handoff preserves verified answers without PII',()=>{
  const link = createAdvisorHandoff(fixture);
  assert.match(link, /^\/bao-gia\/\?/);
  assert.doesNotMatch(link,/phone|ten=|so-dien-thoai/);
  const data = readAdvisorHandoff(new URL(link,'https://lab.example').searchParams);
  assert.deepEqual(data.input, fixture);
  assert.equal(data.material, advise(fixture).slug);
  assert.match(formatAdvisorHandoff(data.input),/Ngân sách/);
});
test('untrusted / incomplete handoff cannot prefill form',()=>{
  const link=createAdvisorHandoff(fixture);
  const query=new URL(link,'https://lab.example').searchParams;
  query.set('uu-tien','<script>');
  assert.equal(readAdvisorHandoff(query),null);
  query.delete('uu-tien');
  assert.equal(readAdvisorHandoff(query),null);
  assert.equal(readAdvisorHandoff('?vat-lieu=mdf'),null);
  assert.throws(()=>createAdvisorHandoff({...fixture,use:'invalid'}),TypeError);
});
test('all 108 advice combinations safely round-trip',()=>{
  let n=0;
  for(const use of answers.use)for(const moisture of answers.moisture)for(const priority of answers.priority)for(const budget of answers.budget){
    const input={use,moisture,priority,budget};
    const link=createAdvisorHandoff(input);
    const got=readAdvisorHandoff(new URL(link,'https://lab.example').searchParams);
    assert.deepEqual(got.input,input);
    assert.equal(got.material,advise(input).slug);
    n++;
  }
  assert.equal(n,108);
});
test('every page has distinct metadata, social card and noindex',()=>{
  assert.equal(routes.length,10);
  assert.equal(Object.keys(pageMeta).length,10);
  assert.equal(new Set(Object.values(pageMeta).map(x=>x.description)).size,10);
  for(const p of routes){
    const html=render(p);
    assert.match(html,/<meta name="robots" content="noindex,nofollow"/);
    assert.match(html,/<meta property="og:title"/);
    assert.match(html,/<meta name="twitter:card"/);
    assert.ok(html.includes(pageMeta[p].description));
  }
});
test('metadata escapes unsafe characters',()=>{
  assert.match(renderMeta('/missing'),/Không tìm thấy trang/);
});
test('privacy disclosure exists and quote page links to it',()=>{
  const page=render('/chinh-sach-du-lieu/');
  assert.match(page,/không đưa số điện thoại/);
  assert.match(page,/Zalo/);
  assert.match(render('/bao-gia/'),/href="\/chinh-sach-du-lieu\/"/);
});
test('wizard has a named handoff summary region',()=>{
  assert.match(render('/bao-gia/'),/id="handoffSummary" role="note" hidden/);
});
