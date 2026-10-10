// v76: the picture behind "Save card": both sides of the travel card, front above back, on the site's paper.
// Needs the built site running (npx vite preview --port 4173) and Playwright (NODE_PATH=$(npm root -g)).
// Run: node dev/card/shot.cjs  →  public/media/card/Wenyi_Zhu_card.png   (rebuild after, so dist has it)
// The web fonts are embedded from node_modules/@fontsource, so the picture never depends on Google Fonts.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.join(__dirname, '../..');
const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
const face = (family, weight, style, b64) => `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
const fonts = [400, 500, 600, 800].map((w) => face('Schibsted Grotesk', w, 'normal', font('schibsted-grotesk', `schibsted-grotesk-latin-${w}-normal.woff2`))).join('')
  + face('Instrument Serif', 400, 'italic', font('instrument-serif', 'instrument-serif-latin-400-italic.woff2'));

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await p.goto(process.env.SITE || 'http://localhost:4173/');
  await p.addStyleTag({ content: fonts });
  await p.waitForSelector('#take-card');
  await p.click('#take-card');
  await p.waitForSelector('.tc-flip');
  await p.evaluate(async () => {
    // lay both faces out flat, one above the other, on the paper colour
    const sheet = document.createElement('div');
    sheet.id = 'card-sheet';
    sheet.style.cssText = 'position:fixed;inset:0 auto auto 0;z-index:99;background:var(--bg);padding:48px;display:grid;gap:40px;width:max-content';
    document.querySelectorAll('.tc-face .tc-box').forEach((box) => {
      const c = box.cloneNode(true);
      c.style.width = '600px';
      c.querySelectorAll('.tc-glare').forEach((g) => g.remove());
      sheet.appendChild(c);
    });
    document.querySelector('dialog.lightbox')?.close();
    document.body.appendChild(sheet);
    await document.fonts.ready;
    await Promise.all([...sheet.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
  });
  const out = path.join(root, 'public/media/card/Wenyi_Zhu_card.png');
  await (await p.$('#card-sheet')).screenshot({ path: out });
  console.log('wrote', path.relative(root, out));
  await b.close();
})();
