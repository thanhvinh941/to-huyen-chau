#!/usr/bin/env node
/**
 * build.js - ghép partial HTML thành site tĩnh trong dist/
 *
 * Cú pháp dùng trong src/:
 *   <!--#include partials/layout/head.html -->   chèn file (đường dẫn tính từ src/)
 *   <!--#var title="Tiêu đề" -->                 khai báo biến cho trang
 *   {{title}}                                    in giá trị biến
 *
 * Quy ước output:
 *   src/pages/index.html          -> dist/index.html
 *   src/pages/ve-chung-toi.html   -> dist/ve-chung-toi/index.html  (URL: /ve-chung-toi/)
 *   src/pages/san-pham/abc.html   -> dist/san-pham/abc/index.html
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const PAGES = path.join(SRC, 'pages');

const read = (p) => fs.readFileSync(p, 'utf8');

function include(html, depth = 0) {
  if (depth > 10) throw new Error('Include lồng quá sâu (vòng lặp?)');
  return html.replace(/<!--#include\s+(\S+)\s*-->/g, (_, file) => {
    const full = path.join(SRC, file);
    if (!fs.existsSync(full)) throw new Error(`Không thấy partial: ${file}`);
    return include(read(full), depth + 1);
  });
}

function extractVars(html) {
  const vars = {};
  const out = html.replace(/[ \t]*<!--#var\s+(\w+)="([^"]*)"\s*-->\r?\n?/g, (_, k, v) => {
    vars[k] = v;
    return '';
  });
  return [out, vars];
}

function bundleCss(file) {
  return read(file).replace(/@import\s+(?:url\()?['"]?([^'")]+)['"]?\)?\s*;/g, (_, rel) =>
    bundleCss(path.join(path.dirname(file), rel))
  );
}

function listPages(dir, base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const rel = path.posix.join(base, e.name);
    if (e.isDirectory()) return listPages(path.join(dir, e.name), rel);
    return e.name.endsWith('.html') ? [rel] : [];
  });
}

function buildPage(rel) {
  let html = include(read(path.join(PAGES, rel)));
  let vars;
  [html, vars] = extractVars(html);

  const slug = rel.replace(/\.html$/, '');
  const urlPath = slug === 'index' ? '/' : '/' + slug.replace(/\/index$/, '');
  vars.path = urlPath;

  html = html.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) console.warn(`  ! ${rel}: thiếu biến {{${k}}}`);
    return vars[k] ?? '';
  });

  // Đánh dấu link nav của trang hiện tại
  html = html.replace(/(<a class="nav__link"[^>]*?href="([^"]+)")/g, (m, a, href) =>
    href === urlPath ? `${a} aria-current="page"` : m
  );

  // Biến link gốc "/..." thành tương đối theo độ sâu trang -> chạy được khi mở file://,
  // deploy thư mục con (GitHub Pages dạng user.github.io/repo/) hay tên miền riêng.
  // Trong src/ vẫn viết /assets/..., /san-pham... cho gọn.
  const depth = slug === 'index' ? 0 : slug.replace(/\/index$/, '').split('/').length;
  const prefix = depth ? '../'.repeat(depth) : './';
  html = html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${prefix}${rest}"`);

  const outFile =
    slug === 'index' ? path.join(DIST, 'index.html') : path.join(DIST, slug.replace(/\/index$/, ''), 'index.html');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  return path.relative(__dirname, outFile);
}

function build() {
  const t = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // assets (trừ css nguồn, css được gộp riêng)
  const assets = path.join(SRC, 'assets');
  fs.cpSync(assets, path.join(DIST, 'assets'), {
    recursive: true,
    filter: (p) => !p.startsWith(path.join(assets, 'css')),
  });
  const cssOut = path.join(DIST, 'assets', 'css');
  fs.mkdirSync(cssOut, { recursive: true });
  fs.writeFileSync(path.join(cssOut, 'main.css'), bundleCss(path.join(assets, 'css', 'main.css')));

  const built = listPages(PAGES).map(buildPage);
  console.log(`Build xong ${built.length} trang trong ${Date.now() - t}ms`);
  built.forEach((f) => console.log('  ' + f));
}

function run() {
  try {
    build();
  } catch (e) {
    console.error('Lỗi build:', e.message);
    if (!process.argv.includes('--watch')) process.exit(1);
  }
}

run();

if (process.argv.includes('--watch')) {
  console.log('Đang theo dõi src/ ...');
  let timer;
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  });
}
