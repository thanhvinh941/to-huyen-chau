// Validate the generated artifact used by both local serving and deployment.
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../dist');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const files = walk(root).filter((file) => file.endsWith('.html'));
const pages = new Map(files.map((file) => [file, fs.readFileSync(file, 'utf8')]));
let links = 0, anchors = 0;
for (const [file, html] of pages) {
  const label = path.relative(root, file);
  assert(!/\{\{\w+\}\}|<!--#include/.test(html), `${label}: unresolved template`);
  assert(!html.includes('.preview-build'), `${label}: temporary output referenced`);
  assert(html.includes('data-header') && html.includes('class="footer"'), `${label}: missing shared layout`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${label}: duplicate IDs`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    assert(url && url !== '#', `${label}: empty link`);
    if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
    const parsed = new URL(url, 'https://local.invalid/' + path.relative(root, file).replaceAll(path.sep, '/'));
    let target = path.resolve(root, '.' + decodeURIComponent(parsed.pathname));
    assert(target === root || target.startsWith(root + path.sep), `${label}: path outside artifact`);
    assert(fs.existsSync(target), `${label}: missing ${url}`);
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), `${label}: missing directory index ${url}`);
    if (parsed.hash) {
      const destination = pages.get(target) || fs.readFileSync(target, 'utf8');
      const id = decodeURIComponent(parsed.hash.slice(1));
      assert(destination.includes(`id="${id}"`), `${label}: missing anchor ${url}`);
      anchors++;
    }
    links++;
  }
  for (const [, names] of html.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    names.split(/\s+/).forEach((id) => assert(ids.includes(id), `${label}: missing accessible reference ${id}`));
  }
}
const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/products.json'), 'utf8'));
for (const product of products) {
  const html = pages.get(path.join(root, 'san-pham', product.slug, 'index.html'));
  assert(html, `Missing product ${product.slug}`);
  assert(html.includes(`../../lien-he?san-pham=${product.slug}`), `Missing consultation link ${product.slug}`);
  assert(html.includes('aria-current="location"'), `Missing parent navigation ${product.slug}`);
}
console.log(`PASS: ${pages.size} pages; ${links} internal links/assets; ${anchors} anchors; shared layouts, IDs and product CTAs`);
