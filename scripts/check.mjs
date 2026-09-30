// Guardrails. Runs before every build (`npm run build`), and on its own with `npm run check`.
// `npm run check -- --launch` adds the go-live checks. Each rule here exists because a
// mistake of that kind happened once — see docs/LESSONS.md.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const launch = process.argv.includes('--launch');
const errors = [];
const fail = (rule, msg) => errors.push(`[${rule}] ${msg}`);

const src = 'src';
const css = readFileSync(join(src, 'style.css'), 'utf8');
const tsFiles = readdirSync(src).filter((f) => f.endsWith('.ts'));
const ts = Object.fromEntries(tsFiles.map((f) => [f, readFileSync(join(src, f), 'utf8')]));
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

/* 1. Colours only in :root (base tokens). */
const rootEnd = css.indexOf('}', css.indexOf(':root'));
const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(|(?<![-\w])(?:black|white|red|blue|green|yellow|gray|grey|orange)(?![-\w])/gi;
stripComments(css.slice(rootEnd)).split('\n').forEach((line, i) => {
  if (COLOR.test(line)) fail('no-hardcoded-colour', `style.css after :root: ${line.trim()}`);
  COLOR.lastIndex = 0;
});
for (const [f, text] of Object.entries(ts)) {
  stripComments(text).split('\n').forEach((line) => {
    if (/#[0-9a-f]{6}\b|\brgba?\(/i.test(line)) fail('no-hardcoded-colour', `${f}: ${line.trim()}`);
  });
}

/* 2. Breakpoints: CSS @media can't use variables, so the phone query must match the token JS reads. */
const mqPhone = css.match(/--mq-phone:\s*([^;]+);/)?.[1].trim();
if (!mqPhone) fail('breakpoint', '--mq-phone token missing');
else if (!css.includes(`@media ${mqPhone}`)) fail('breakpoint', `no "@media ${mqPhone}" block — CSS and --mq-phone disagree`);
const mediaWidths = [...css.matchAll(/@media \(max-width: (\d+)px\)/g)].map((m) => m[1]);
const dupMedia = mediaWidths.filter((w, i) => mediaWidths.indexOf(w) !== i);
if (dupMedia.length) fail('one-block-per-breakpoint', `@media (max-width) repeated for: ${[...new Set(dupMedia)].join(', ')}px`);

/* 2b. Card type scale (L21): card rules use the --fs-* tokens only — one face, two sizes. */
stripComments(css.slice(rootEnd)).split('\n').forEach((line) => {
  if (/^\.(p-|sec|nlink|ix-|ngroup|ixbar|lab\b)/.test(line.trim()) && /font-size:\s*[\d.]+px/.test(line))
    fail('card-type-scale', `card rule with a literal font size: ${line.trim().slice(0, 90)}`);
  if (/^\.(p-|sec|nlink|ix-|ngroup|ixbar|lab\b)/.test(line.trim()) && /font-weight:\s*[6-9]00/.test(line))
    fail('card-type-scale', `card rule with bold type: ${line.trim().slice(0, 90)}`);
});

/* 3. Layout numbers in TS come from CSS tokens, never literals like "72" or "380". */
for (const f of ['main.ts', 'panel.ts', 'mobile.ts', 'blocks.ts']) {
  if (!ts[f]) continue;
  stripComments(ts[f]).split('\n').forEach((line) => {
    if (/matchMedia\(\s*['"`]/.test(line)) fail('no-hardcoded-breakpoint', `${f}: ${line.trim()}`);
    if (/\b(?:[2-9]\d{2}|\d{2})\s*(?:px)?\b/.test(line) && /(?:width|height|top|left|right|bottom|W|H|inset|gap)\b/.test(line) && !/cssPx|cssVar/.test(line))
      fail('no-hardcoded-size', `${f}: ${line.trim()}`);
  });
}

/* 3b. One decision point for shapes (L17): views draw a node with iconFor()/shapeFor(), never icon(n.type). */
for (const f of ['panel.ts', 'mobile.ts', 'main.ts', 'map.ts', 'blocks.ts']) {
  if (ts[f] && /icon\(\s*n\.type/.test(ts[f])) fail('shape-from-kindOf', `${f} draws a node with icon(n.type) — use iconFor(n)`);
  if (ts[f] && /typeLabel\[\s*n\.type\s*\]/.test(ts[f])) fail('shape-from-kindOf', `${f} labels a node with typeLabel[n.type] — use kindLabel(n.id)`);
}

/* 4. Content integrity. */
const content = await import('../src/content.ts');
const { ui, nodes, byId, rolesOrder, schoolsOrder, site } = content;
const allCode = Object.entries(ts).filter(([f]) => f !== 'content.ts').map(([, t]) => t).join('\n');
for (const k of Object.keys(ui)) {
  if (!new RegExp(`ui\\.${k}\\b|['"\`]${k}['"\`]`).test(allCode)) fail('no-dead-strings', `ui.${k} is never used`);
}
for (const n of nodes) {
  if (n.parent && !byId.has(n.parent)) fail('content', `${n.id}: parent "${n.parent}" does not exist`);
  for (const r of n.related || []) if (!byId.has(r)) fail('content', `${n.id}: related "${r}" does not exist`);
  if (n.org && !byId.has(n.org)) fail('content', `${n.id}: org "${n.org}" does not exist`);
  if (n.type === 'case' && !n.status && !n.headline) fail('content', `${n.id}: every case needs a headline number`);
}
for (const id of [...rolesOrder, ...schoolsOrder]) if (!byId.has(id)) fail('content', `order list names missing node "${id}"`);
// HOME_LAYOUT (map.ts) must only name real nodes, or that point silently loses its fixed place
const homeBlock = ts['map.ts'].match(/HOME_LAYOUT[^=]*=\s*\{([\s\S]*?)\n\};/);
if (!homeBlock) fail('content', 'HOME_LAYOUT not found in map.ts');
else for (const m of homeBlock[1].matchAll(/^\s*'?([\w-]+)'?\s*:/gm)) if (!byId.has(m[1])) fail('content', `HOME_LAYOUT names missing node "${m[1]}"`);
const ids = nodes.map((n) => n.id);
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => fail('content', `duplicate id "${id}"`));

/* L30: professional shorthand — CPM / CPA / CPI, and no "repeated every/each" for a process. */
const copyText = readFileSync(join(src, 'content.ts'), 'utf8') + readFileSync(join(src, 'published-copy.json'), 'utf8');
for (const re of [/cost per install/i, /per 1,000 views/i, /repeated (each|every)/i]) {
  const m = copyText.match(re);
  if (m) fail('copy-shorthand', `found "${m[0]}" — use CPM / CPA / CPI, or "refined" instead of "repeated"`);
}

/* 5. Go-live gate: nothing unfinished reaches the public site. */
if (launch) {
  if (!site.launched) fail('launch', 'site.launched is false (PROTOTYPE label still shown)');
  if (!site.email) fail('launch', 'site.email is empty');
  if (!site.resumePdf) fail('launch', 'site.resumePdf is empty');
  if (site.resumePdf.startsWith('/')) fail('launch', 'site.resumePdf must be relative (GitHub Pages serves under a sub-path)');
  const raw = readFileSync(join(src, 'content.ts'), 'utf8');
  const marks = raw.match(/\[(?:Placeholder|Draft)[^\]]*\]/g) || [];
  if (marks.length) fail('launch', `${marks.length} [Placeholder]/[Draft] marks remain in content.ts`);
}

if (errors.length) {
  console.error(`check failed (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`check passed${launch ? ' (launch)' : ''}`);
