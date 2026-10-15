import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, routes } from '../src/site.mjs';
import { websiteContext } from '../src/website-context.mjs';

const assetDir = fileURLToPath(new URL('../public/catalog-assets/', import.meta.url));

test('websiteContext holds required BCM V2 structures without private leaks', () => {
  assert.ok(websiteContext.business);
  assert.equal(websiteContext.business.city, 'Quy Nhơn');
  assert.equal(websiteContext.business.locations.length, 3);
  assert.ok(websiteContext.brand.positioning.includes('Quy Nhơn'));
  assert.equal(websiteContext.brand.principles4D.length, 4);

  // Check 2 personas
  assert.equal(websiteContext.personas.length, 2);
  const cdNam = websiteContext.personas.find(p => p.id === 'CD-NAM');
  const cdLan = websiteContext.personas.find(p => p.id === 'CD-LAN');
  assert.ok(cdNam && cdLan);
  assert.equal(cdNam.ctaHref, '/bao-gia/?muc-dich=kiem-gia');
  assert.equal(cdLan.ctaHref, '/chon-vat-lieu/');

  // Ensure no forbidden private fields
  const serialized = JSON.stringify(websiteContext);
  for (const forbidden of ['cost_price', 'stock_qty', 'internal_notes', 'nha_cung_cap', 'password', 'api_key', 'secret']) {
    assert.ok(!serialized.includes(`"${forbidden}"`), `Forbidden leak: ${forbidden}`);
  }
});

test('homepage renders real hero images and all referenced assets exist on disk', () => {
  const html = render('/');

  // Real images in Hero
  assert.match(html, /src="\/catalog-assets\/mdf012-1\.webp"/);
  assert.match(html, /src="\/catalog-assets\/cph003-1\.webp"/);
  assert.match(html, /src="\/catalog-assets\/cmb006-1\.webp"/);

  // Check every referenced /catalog-assets/ image exists
  const imgMatches = [...html.matchAll(/src="(\/catalog-assets\/[^"]+)"/g)];
  assert.ok(imgMatches.length >= 8, `Expected at least 8 real images on homepage, found ${imgMatches.length}`);

  for (const match of imgMatches) {
    const filename = match[1].replace('/catalog-assets/', '');
    const fullPath = join(assetDir, filename);
    assert.ok(existsSync(fullPath), `Missing image on disk: ${filename}`);
  }
});

test('dual-track CTA routing for CD-NAM and CD-LAN is present with tracking', () => {
  const html = render('/');

  // Primary CTA for CD-LAN (Chưa biết chọn ván)
  assert.match(html, /data-track="start_advisor"[^>]*href="\/chon-vat-lieu\/"|href="\/chon-vat-lieu\/"[^>]*data-track="start_advisor"/);
  assert.match(html, /Tôi chưa biết chọn ván/);

  // Secondary CTA for CD-NAM (Đã có quy cách - kiểm giá)
  assert.match(html, /data-track="request_quote"[^>]*href="\/bao-gia\/\?muc-dich=kiem-gia"|href="\/bao-gia\/\?muc-dich=kiem-gia"[^>]*data-track="request_quote"/);
  assert.match(html, /Tôi đã có quy cách — kiểm giá/);

  // Section 02 Intent Cards for both personas
  assert.match(html, /Chủ nhà sửa nhà \/ Lan/);
  assert.match(html, /Thầu thợ & Xưởng \/ Nam/);
  assert.match(html, /Dự toán công trình/);
});

test('Section 04 displays featured catalog items linking to genuine product pages', () => {
  const html = render('/');
  assert.match(html, /href="\/san-pham\/mdf-chong-am\/"/);
  assert.match(html, /href="\/san-pham\/coppha-phim\/"/);
  assert.match(html, /href="\/san-pham\/cemboard\/"/);
  assert.match(html, /href="\/san-pham\/mdf-chong-am-melamine\/"/);
  assert.match(html, /href="\/san-pham\/van-ep-carb-p2\/"/);
  assert.match(html, /href="\/san-pham\/alu-lion\/"/);

  // Verify all linked routes exist in catalog
  for (const slug of ['mdf-chong-am', 'coppha-phim', 'cemboard', 'mdf-chong-am-melamine', 'van-ep-carb-p2', 'alu-lion']) {
    const target = `/san-pham/${slug}/`;
    assert.ok(routes.includes(target), `Missing route: ${target}`);
  }
});

test('Section 09 displays warehouse trust proof with genuine material samples', () => {
  const html = render('/');
  assert.match(html, /GẶP HÀ VY Ở QUY NHƠN/);
  assert.match(html, /157 Nguyễn Thái Học · 200 Hoàng Văn Thụ · 28 Hùng Vương, Quy Nhơn/);
  assert.match(html, /Đang bổ sung ảnh kho đã xác minh/);
  assert.match(html, /src="\/catalog-assets\/cph003-2\.webp"/);
  assert.match(html, /src="\/catalog-assets\/mdf012-1\.webp"/);
  assert.match(html, /src="\/catalog-assets\/cmb006-2\.webp"/);
});

test('Strict absence of fake claims, false addresses or fabricated metrics', () => {
  const html = render('/');
  assert.doesNotMatch(html, /52 Tăng Bạt Hổ/);
  assert.doesNotMatch(html, /3\.000\+ công trình/);
  assert.doesNotMatch(html, /30 năm không đổi/);
  assert.doesNotMatch(html, /Còn hàng/);
  assert.doesNotMatch(html, /Từ 700\.000đ/);
});
