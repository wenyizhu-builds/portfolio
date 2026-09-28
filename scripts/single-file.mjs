// Builds preview.html: the whole site in one file you can double-click to open (no server needed).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
let html = readFileSync(join(dist, 'index.html'), 'utf8');
html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/, (_, f) =>
  `<script type="module">${readFileSync(join(dist, f), 'utf8').replace(/<\/script/g, '<\\/script')}</script>`,
);
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/, (_, f) =>
  `<style>${readFileSync(join(dist, f), 'utf8')}</style>`,
);
writeFileSync('preview.html', html);
console.log('preview.html written');
