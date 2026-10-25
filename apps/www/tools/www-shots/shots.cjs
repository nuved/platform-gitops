// Shoots and measures every page of the rendered site (configmap.yaml, as the box serves it): full-page PNGs at 1440×900 and 390×844 in light and dark, plus contrast, targets, overflow, fonts and gradients as JSON.
//
//   cd ~/claude/plans-backend/web && node <repo>/apps/www/tools/www-shots/shots.cjs <repo>/apps/www <out-dir>
//
// Run it from a directory whose node_modules holds @playwright/test (plans-backend/web has it); the
// page files come from configmap.yaml, so run ./render.sh first. Nothing is fetched from anywhere: a
// local server hands Chromium the ConfigMap's keys, and every other request is refused and reported.
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require(path.join(process.cwd(), 'node_modules/@playwright/test'));

const [,, www, out] = process.argv;
if (!www || !out) { console.error('usage: shots.cjs <apps/www> <out-dir>'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });

// configmap.yaml is written by render.sh in one shape: "  key: |" then the text indented by four
// spaces, and under binaryData "  key: <base64 on one line>". That shape is all this reads.
function unpack(file) {
  const files = {}; let section = null, key = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (/^data:\s*$/.test(line)) { section = 'data'; key = null; continue; }
    if (/^binaryData:\s*$/.test(line)) { section = 'bin'; key = null; continue; }
    if (!section) continue;
    let m;
    if (section === 'data' && (m = line.match(/^  ([-._A-Za-z0-9]+): \|$/))) { key = m[1]; files[key] = []; continue; }
    if (section === 'bin' && (m = line.match(/^  ([-._A-Za-z0-9]+): (\S+)$/))) { files[m[1]] = Buffer.from(m[2], 'base64'); continue; }
    if (section === 'data' && key && line.startsWith('    ')) files[key].push(line.slice(4));
    else if (section === 'data' && key && line === '') files[key].push('');
  }
  for (const k of Object.keys(files)) if (Array.isArray(files[k])) files[k] = Buffer.from(files[k].join('\n').replace(/\n*$/, '\n'));
  return files;
}

const files = unpack(path.join(www, 'configmap.yaml'));
const PAGES = ['index.html', 'how-it-works.html', 'features.html'];
const TYPES = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const refused = [];
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
  const body = files[name] || files[name + '.html'];
  if (!body) { refused.push(req.url); res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(name)] || TYPES['.html'] }); res.end(body);
});

// Runs in the page. Text contrast two ways: against the painted background colour (the walk up the
// tree), and inside the hero against the real pixels behind the text, sampled from a shot taken with
// every text colour set to transparent, because the mesh is a background image the walk cannot see.
function measure() {
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const rgb = c => c.match(/[\d.]+/g).slice(0, 4).map(Number);
  const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const bg = getComputedStyle(e).backgroundColor; const v = rgb(bg); if (v.length < 4 || v[3] > 0) return v.slice(0, 3); } return rgb(getComputedStyle(document.body).backgroundColor).slice(0, 3); };
  const texts = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || el.closest('svg')) continue;
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(); if (!txt) continue;
    const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight);
    const big = fs >= 24 || (fs >= 18.66 && fw >= 700);
    // The box of the glyphs themselves (a range over the element's own text), not the element's:
    // a pill's bounding box has canvas pixels in its corners.
    const range = document.createRange(), boxes = [];
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { range.selectNodeContents(n); for (const r of range.getClientRects()) if (r.width && r.height) boxes.push([r.left + scrollX, r.top + scrollY, r.width, r.height].map(Math.round)); }
    texts.push({ text: txt.slice(0, 40), fg: rgb(cs.color).slice(0, 3), bg: bgOf(el), need: big ? 3 : 4.5, fs, hero: !!el.closest('.hero'), boxes });
  }
  const fails = [], pairs = new Map();
  for (const t of texts) {
    const c = ratio(t.fg, t.bg); t.c = c;
    const k = `rgb(${t.fg}) on rgb(${t.bg})`; if (!pairs.has(k) || pairs.get(k).c > c) pairs.set(k, { pair: k, c: +c.toFixed(2), ex: t.text.slice(0, 24) });
    if (c < t.need) fails.push({ text: t.text, c: +c.toFixed(2), need: t.need, fs: t.fs });
  }
  const targets = [];
  for (const el of document.querySelectorAll('a,button,[role=button],input,select,summary')) {
    if (!vis(el)) continue; const r = el.getBoundingClientRect();
    const inline = getComputedStyle(el).display === 'inline' && !!el.closest('p,li,figcaption');
    targets.push({ t: (el.getAttribute('aria-label') || el.textContent.trim()).slice(0, 28), w: Math.round(r.width), h: Math.round(r.height), inline });
  }
  targets.sort((a, b) => Math.min(a.w, a.h) - Math.min(b.w, b.h));
  const grads = [];
  for (const el of document.querySelectorAll('*')) for (const pseudo of [null, '::before', '::after']) {
    const bi = getComputedStyle(el, pseudo).backgroundImage;
    if (bi && bi.includes('gradient')) grads.push((el.className ? '.' + String(el.className).split(' ')[0] : el.tagName.toLowerCase()) + (pseudo || ''));
  }
  const wide = [];
  for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.width && r.right > innerWidth + 1 && !el.closest('pre')) wide.push(el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 20)); }
  return {
    fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
    body: { family: getComputedStyle(document.body).fontFamily.split(',')[0], size: getComputedStyle(document.body).fontSize },
    overflow: document.documentElement.scrollWidth > innerWidth ? `scrollWidth ${document.documentElement.scrollWidth} > ${innerWidth}` : 'none',
    wide: wide.slice(0, 6), fails, lowest: [...pairs.values()].sort((a, b) => a.c - b.c).slice(0, 4),
    targets: targets.length, smallest: targets.filter(t => !t.inline).slice(0, 4), inlineSmallest: targets.filter(t => t.inline).slice(0, 2),
    gradients: grads, heroTexts: texts.filter(t => t.hero).flatMap(({ text, fg, need, boxes }) => boxes.map(box => ({ text, fg, need, box }))),
    pageHeight: document.documentElement.scrollHeight,
  };
}

// The darkest-and-lightest pixels under each hero text box, from a shot with the text made invisible.
async function heroPixels(page, heroTexts) {
  if (!heroTexts.length) return [];
  await page.addStyleTag({ content: '.hero, .hero * { color: transparent !important; -webkit-text-fill-color: transparent !important; }' });
  const png = await page.screenshot({ fullPage: true });
  // Decode in the browser: an <img> of the shot on a canvas, read the boxes' pixels back.
  return page.evaluate(async ({ b64, boxes }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
    const dpr = img.width / document.documentElement.scrollWidth;
    return boxes.map(({ text, fg, need, box: [x, y, w, h] }) => {
      const d = cx.getImageData(Math.round(x * dpr), Math.round(y * dpr), Math.max(1, Math.round(w * dpr)), Math.max(1, Math.round(h * dpr))).data;
      let worst = Infinity;
      for (let i = 0; i < d.length; i += 4) { const c = ratio(fg, [d[i], d[i + 1], d[i + 2]]); if (c < worst) worst = c; }
      return { text: text.slice(0, 32), worst: +worst.toFixed(2), need, pass: worst >= need };
    });
  }, { b64: png.toString('base64'), boxes: heroTexts });
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();
  const report = [];
  for (const name of PAGES) for (const [w, h] of [[1440, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(base + name, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const shot = path.join(out, `${name.replace('.html', '')}-${w}-${scheme}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    const m = await page.evaluate(measure);
    m.heroPixels = await heroPixels(page, m.heroTexts); delete m.heroTexts;
    report.push({ page: name, viewport: `${w}x${h}`, scheme, shot: path.basename(shot), bytes: fs.statSync(shot).size, ...m });
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(JSON.stringify({ refused, report }, null, 1));
})();
