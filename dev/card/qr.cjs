// v76: the QR code on the back of the travel card. Run: node dev/card/qr.cjs  →  public/media/card/qr.svg
// The address is the site's published address; the ink colour is read from style.css (--ink).
const fs = require('fs'), path = require('path');
const qrcode = require('qrcode-generator');
const URL = 'https://wenyizhu-builds.github.io/portfolio/';
const css = fs.readFileSync(path.join(__dirname, '../../src/style.css'), 'utf8');
const ink = css.match(/--ink:\s*(#[0-9a-f]+)/i)[1];
const qr = qrcode(0, 'M'); qr.addData(URL); qr.make();
const n = qr.getModuleCount(); let d = '';
for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
fs.writeFileSync(path.join(__dirname, '../../public/media/card/qr.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><path d="${d}" fill="${ink}"/></svg>\n`);
console.log('qr.svg', n, 'modules →', URL);
