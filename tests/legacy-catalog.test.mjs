import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { families, variants, catalogPaths } from '../src/catalog.mjs';
import { routes, render } from '../src/site.mjs';
const assetDir=fileURLToPath(new URL('../public/catalog-assets/',import.meta.url));

test('18 historical families and 188 variants are mapped without duplicate route',()=>{
 assert.equal(families.length,18);
 assert.equal(variants.length,188);
 assert.equal(catalogPaths.length,207);
 assert.equal(new Set(catalogPaths).size,catalogPaths.length);
 assert.equal(routes.length,217);
});
test('catalog shows genuine source images with a warning and complete route links',()=>{
 const html=render('/san-pham/');
 assert.match(html,/18 dòng vật liệu/);
 assert.match(html,/188/);
 assert.match(html,/Thông tin từ hồ sơ lưu trữ/);
 assert.match(html,/id="legacyGroup"/);
 for(const f of families) {
   const url='/san-pham/'+encodeURIComponent(f.slug)+'/';
   assert.ok(catalogPaths.includes(url));
   assert.ok(render(url).includes(f.sku));
   for(const path of f.gallery) {
     const file=join(assetDir,basename(path));
     assert.ok(existsSync(file),'Missing catalog asset: '+path);
   }
 }
});
test('SKU details never claim live stock or prices and link to verified quote handoff',()=>{
 for(const v of variants) {
   const url='/ma-hang/'+encodeURIComponent(v.slug)+'/';
   const html=render(url);
   assert.match(html,/Không có giá, tồn kho/);
   assert.match(html,/\/bao-gia\/\?muc-dich=kiem-gia/);
   assert.ok(html.includes(v.sku));
   assert.doesNotMatch(html,/52 Tăng Bạt Hổ|Còn hàng|Từ 700.000đ/);
 }
});
test('imported JSON holds no historical financial or private ERP columns',()=>{
 const src=readFileSync(new URL('../src/catalog-data.json',import.meta.url),'utf8');
 for(const forbidden of ['cost_price','stock_qty','ref_price','phone','internal_notes','nha_cung_cap','price_display_mode','last_modified','uploaded_by'])
   assert.ok(!src.includes('"'+forbidden+'"'),'Unexpected private field: '+forbidden);
});
