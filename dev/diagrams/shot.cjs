const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 700, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/diagrams.html'); await p.evaluate(() => document.fonts.ready); await p.waitForSelector('body[data-ready]');
  await p.screenshot({ path: __dirname + '/all.png', fullPage: true });
  for (const k of ['ua','gip','zzz','lp']) await (await p.$('#dg-' + k)).screenshot({ path: `${__dirname}/${k}.png` });
  await b.close();
})();
