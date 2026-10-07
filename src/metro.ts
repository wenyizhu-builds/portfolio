/* The home map as a metro map (v70, branch metro-map; design in docs/SPEC.md, "Rising").
   Same API as map.ts (MapApi), so main.ts only swaps one call. Everything about the drawing —
   where each station sits, the shape of each line, where the notes go — lives in METRO below.
   Colours and sizes come from style.css (:root); words from content.ts. */
import { byId, ui, type SiteNode } from './content';
import type { MapApi } from './map';
import { esc, filtering, go, matches, t } from './state';

const SVGNS = 'http://www.w3.org/2000/svg';
type Pos = 'left' | 'right' | 'above' | 'below';
type Pt = [number, number];
type LineKey = 'career' | 'campus' | 'creative' | 'paid' | 'social' | 'ai';

/* Map units (≈ px at the normal size). The career line rises on a 45° diagonal to ✳ Next stop. */
const METRO = {
  view: { x: 30, y: 100, w: 860, h: 670 }, // the drawing's frame; scaled to fit the free area left of the card
  maxScale: 1.1, // never larger than this on wide screens
  corner: 24, // rounded bends
  wrap: 18, // characters per label line
  lineH: 15, // label line height
  /** Each line: the group it opens in the card, its track (bends only), and where its name sits. */
  lines: {
    career: { group: 'experience', name: ui.lineCareer, track: [[140, 700], [640, 200]], label: [300, 610, 'middle', -45] },
    campus: { group: 'education', name: ui.lineCampus, track: [[140, 700], [320, 700], [410, 610], [410, 430]], label: [230, 748, 'middle', 0] },
    creative: { group: 'creative', name: ui.lineCreative, track: [[140, 700], [80, 640], [80, 560]], label: [80, 545, 'middle', 0] },
    paid: { group: 'growth-paid', name: ui.linePaid, track: [[500, 340], [500, 220], [440, 160], [200, 160]], label: [186, 164, 'end', 0] },
    social: { group: 'growth-social', name: ui.lineSocial, track: [[500, 340], [580, 420], [580, 600], [640, 660], [760, 660]], label: [640, 700, 'end', 0] },
    ai: { group: 'ai', name: ui.lineAi, track: [[640, 200], [760, 320], [760, 660]], label: [774, 590, 'start', 0] },
  } as Record<LineKey, { group: string; name: typeof ui.lineAi; track: Pt[]; label: [number, number, 'start' | 'middle' | 'end', number] }>,
  /** Every station: node id → where, which lines stop there (first = the line it opens), where its name goes. */
  stations: {
    xjtlu: [140, 700, 'career campus creative', 'left'],
    nowness: [210, 630, 'career', 'left'],
    'weber-shandwick': [270, 570, 'career', 'left'],
    nike: [330, 510, 'career', 'left'],
    uchicago: [250, 700, 'campus', 'below'],
    'seminary-coop': [410, 430, 'career campus', 'left'],
    hoyoverse: [500, 340, 'career paid social', 'left'],
    'ua-creative-strategy': [500, 280, 'paid', 'left'],
    'gip-testing': [470, 190, 'paid', 'right'],
    'xbox-launch': [340, 160, 'paid', 'above'],
    'landing-page': [260, 160, 'paid', 'below'],
    'zzz-jp-accounts': [540, 380, 'social', 'right'],
    'giveaway-campaign': [580, 455, 'social', 'right'],
    'influencer-activation': [580, 500, 'social', 'right'],
    'interactive-filter': [580, 545, 'social', 'left'],
    'genshin-en-accounts': [690, 660, 'social', 'above'],
    'xhs-ai-channel': [760, 660, 'social ai', 'below'],
    'ai-workbench': [760, 420, 'ai', 'left'],
    'creator-workbench': [760, 520, 'ai', 'left'],
    design: [104, 664, 'creative', 'left'],
    photography: [80, 600, 'creative', 'left'],
  } as Record<string, [number, number, string, Pos]>,
  /** Key cases: a big double ring and an always-visible name (the rest are small dots, named on hover). */
  key: ['ua-creative-strategy', 'gip-testing', 'zzz-jp-accounts', 'interactive-filter', 'ai-workbench'],
  /** Interchanges: the biggest double ring. */
  interchange: ['xjtlu', 'seminary-coop', 'hoyoverse', 'xhs-ai-channel'],
  /** ✳ at the top of the climb; the AI line starts here. Clicking it opens "Let's talk". */
  top: [640, 200] as Pt,
  /** Hand-written notes: whose note (content.ts `note`), the line it belongs to, where the text starts, the arrow from → via → to, tilt. */
  notes: [
    ['ua-creative-strategy', 'paid', 252, 230, [404, 236], [468, 244], [488, 268], -4],
    ['zzz-jp-accounts', 'social', 604, 316, [628, 344], [612, 360], [600, 368], 3],
    ['interactive-filter', 'social', 432, 604, [520, 594], [556, 586], [570, 560], 2],
    ['ai', 'ai', 612, 470, [706, 462], [732, 452], [748, 434], -3],
  ] as [string, LineKey, number, number, Pt, Pt, Pt, number][],
  noteLineH: 21,
  radius: { interchange: [13, 6.5, 3.2, 3], key: [10.5, 4.6, 3, 2.6], dot: [5.6, 0, 2.6, 0], star: 19 }, // outer, inner, outer stroke, inner stroke
  arrowHead: 8,
  transferBow: 0.28, // a transfer arc bows out by this share of its length (at least transferMin)
  transferMin: 34,
};

const f = (v: number) => v.toFixed(1);
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};
function wrap(s: string): string[] {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) {
    if ((cur + ' ' + w).trim().length > METRO.wrap && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}
/** A track through its bends, with rounded corners. */
function trackPath(pts: Pt[]): string {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [p, c, n] = [pts[i - 1], pts[i], pts[i + 1]];
    const l1 = Math.hypot(c[0] - p[0], c[1] - p[1]), l2 = Math.hypot(n[0] - c[0], n[1] - c[1]), r = Math.min(METRO.corner, l1 / 2, l2 / 2);
    const a = [c[0] - (c[0] - p[0]) / l1 * r, c[1] - (c[1] - p[1]) / l1 * r], b = [c[0] + (n[0] - c[0]) / l2 * r, c[1] + (n[1] - c[1]) / l2 * r];
    d += `L${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}`;
  }
  const e = pts[pts.length - 1];
  return d + `L${f(e[0])},${f(e[1])}`;
}
/** A name beside a point, with a halo so it reads over lines. */
function label(x: number, y: number, lines: string[], pos: Pos, cls: string, off: number): string {
  const lh = METRO.lineH, n = lines.length;
  const [tx, ty, a] = ({
    right: [off, 4.5 - (n - 1) * lh / 2, 'start'], left: [-off, 4.5 - (n - 1) * lh / 2, 'end'],
    above: [0, -off - (n - 1) * lh, 'middle'], below: [0, off + 9, 'middle'],
  } as const)[pos];
  const tsp = lines.map((l, i) => `<tspan x="${tx}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('');
  return `<g transform="translate(${f(x)},${f(y)})"><text class="mt-halo ${cls}" text-anchor="${a}" y="${ty}">${tsp}</text><text class="${cls}" text-anchor="${a}" y="${ty}">${tsp}</text></g>`;
}
/** Which line a node opens: its station's first line; groups map to their line. */
function lineOf(id: string): LineKey | null {
  const st = METRO.stations[id];
  if (st) return st[2].split(' ')[0] as LineKey;
  const hit = (Object.keys(METRO.lines) as LineKey[]).find((k) => METRO.lines[k].group === id);
  if (hit) return hit;
  return id === 'info' ? 'career' : null;
}

export function createMetro(host: HTMLElement, onSelect: (id: string) => void): MapApi {
  const svg = el('svg', { class: 'metro', role: 'group' });
  host.appendChild(svg);
  let open: LineKey | null = null, sel: string | null = null;

  function render() {
    svg.setAttribute('aria-label', t(ui.mapLabel));
    const V = METRO.view;
    svg.setAttribute('viewBox', `${V.x} ${V.y} ${V.w} ${V.h}`);
    const keys = Object.keys(METRO.lines) as LineKey[];
    let s = '';
    for (const k of keys) {
      const L = METRO.lines[k], d = trackPath(L.track);
      s += `<path data-l="${k}" class="mt-track l-${k}" d="${d}"/>${k === 'campus' ? `<path data-l="${k}" class="mt-track core" d="${d}"/>` : ''}`;
    }
    for (const k of keys) s += `<path class="mt-hit" data-line="${k}" d="${trackPath(METRO.lines[k].track)}"/>`;
    for (const k of keys) {
      const [x, y, a, rot] = METRO.lines[k].label;
      s += `<text data-l="${k}" data-line="${k}" class="mt-lname" x="${x}" y="${y}" text-anchor="${a}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${esc(t(METRO.lines[k].name))}</text>`;
    }
    for (const [id, k, x, y, from, via, to, rot] of METRO.notes) {
      const txt = t(byId.get(id)?.note);
      if (!txt) continue;
      const lines = txt.split('\n').map((l, i) => `<tspan x="${x}" dy="${i ? METRO.noteLineH : 0}">${esc(l)}</tspan>`).join('');
      const ang = Math.atan2(to[1] - via[1], to[0] - via[0]), h = METRO.arrowHead;
      const h1 = [to[0] - h * Math.cos(ang - 0.5), to[1] - h * Math.sin(ang - 0.5)], h2 = [to[0] - h * Math.cos(ang + 0.5), to[1] - h * Math.sin(ang + 0.5)];
      s += `<g class="mt-note" data-l="${k}" aria-hidden="true"><text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})">${lines}</text><path d="M${from[0]},${from[1]}Q${via[0]},${via[1]} ${to[0]},${to[1]}M${f(h1[0])},${f(h1[1])}L${to[0]},${to[1]}L${f(h2[0])},${f(h2[1])}"/></g>`;
    }
    // ✳ Next stop
    const [tx, ty] = METRO.top, R = METRO.radius;
    const arms = [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 4, X = 10 * Math.cos(a), Y = 10 * Math.sin(a); return `<line x1="${f(-X)}" y1="${f(-Y)}" x2="${f(X)}" y2="${f(Y)}"/>`; }).join('');
    const topText = `<tspan x="0">${esc(t(ui.nextStop))}</tspan><tspan x="0" dy="${METRO.lineH}" class="mt-sub">${esc(t(ui.nextStopSub))}</tspan>`;
    s += `<g class="mt-top" data-l="career ai" role="link" tabindex="0" aria-label="${esc(`${t(ui.nextStop)}: ${t(ui.nextStopSub)}`)}"><circle class="mt-ring" cx="${tx}" cy="${ty}" r="${R.star}" stroke-width="3"/><g class="mt-star" transform="translate(${tx},${ty})">${arms}</g>`
      + `<g transform="translate(${tx},${ty - 44})"><text class="mt-halo mt-lbl b" text-anchor="middle">${topText}</text><text class="mt-lbl b" text-anchor="middle">${topText}</text></g></g>`;
    s += '<g class="mt-xfer"></g>';
    for (const [id, [x, y, lines, pos]] of Object.entries(METRO.stations)) {
      const n = byId.get(id);
      if (!n) continue;
      s += station(n, x, y, lines, pos);
    }
    svg.innerHTML = s;
    apply();
  }

  function station(n: SiteNode, x: number, y: number, lines: string, pos: Pos): string {
    const R = METRO.radius;
    const kind = METRO.interchange.includes(n.id) ? 'interchange' : METRO.key.includes(n.id) ? 'key' : 'dot';
    const [ro, ri, so, si] = R[kind];
    const mark = `<g class="mt-dot"><circle class="mt-ring" cx="${x}" cy="${y}" r="${ro}" stroke-width="${so}"/>${ri ? `<circle class="mt-inner" cx="${x}" cy="${y}" r="${ri}" stroke-width="${si}"/>` : ''}</g>`;
    const place = n.type === 'role' || n.type === 'school';
    const off = kind === 'interchange' ? 19 : kind === 'key' ? 17 : 12;
    const words = place ? [t(n.mapLabel ?? n.label)] : wrap(t(n.mapLabel ?? n.label));
    const cls = n.id === 'hoyoverse' ? 'mt-lbl b' : place ? 'mt-lbl s' : kind === 'dot' ? 'mt-lbl' : 'mt-lbl b';
    const name = label(x, y, words, pos, cls, off);
    const quiet = kind === 'dot' && !place; // other work: named on hover or when its line is open
    return `<g class="mt-stn" data-id="${n.id}" data-l="${lines}" tabindex="0" role="button" aria-label="${esc(t(n.label))}">${mark}${quiet ? `<g class="mt-more">${name}</g>` : name}</g>`;
  }

  /** Fade, name and highlight to match the current focus and filter. */
  function apply() {
    const rel = sel ? (byId.get(sel)?.related ?? []) : [];
    svg.querySelectorAll<SVGElement>('[data-l]').forEach((e) => {
      const on = !open || e.dataset.l!.split(' ').includes(open) || rel.includes(e.dataset.id ?? '');
      e.classList.toggle('faded', !on);
    });
    svg.querySelectorAll<SVGGElement>('.mt-stn').forEach((g) => {
      const id = g.dataset.id!, lines = g.dataset.l!.split(' ');
      g.classList.toggle('sel', id === sel);
      g.classList.toggle('rel', rel.includes(id));
      const out = filtering() && !matches(id);
      g.classList.toggle('mt-out', out && !g.classList.contains('faded'));
      g.querySelector('.mt-more')?.classList.toggle('on', (!!open && lines.includes(open)) || rel.includes(id) || (filtering() && !out));
    });
    const xf = svg.querySelector('.mt-xfer')!;
    xf.innerHTML = sel ? rel.map((r) => transfer(sel!, r)).join('') : '';
  }

  /** A dotted arc between two connected stations, bowed away so it never sits on a line. */
  function transfer(a: string, b: string): string {
    const A = METRO.stations[a], B = METRO.stations[b];
    if (!A || !B) return '';
    const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
    let px = -dy / len, py = dx / len;
    if (px < -1e-6 || (Math.abs(px) < 1e-6 && py > 0)) { px = -px; py = -py; }
    const bow = Math.max(METRO.transferMin, len * METRO.transferBow);
    return `<path class="mt-xf" d="M${A[0]},${A[1]}Q${f((A[0] + B[0]) / 2 + px * bow)},${f((A[1] + B[1]) / 2 + py * bow)} ${B[0]},${B[1]}"/>`;
  }

  svg.addEventListener('click', (e) => {
    const target = e.target as Element;
    if (target.closest('.mt-top')) { go('contact'); return; }
    const stn = target.closest<SVGGElement>('.mt-stn');
    if (stn) { onSelect(stn.dataset.id!); return; }
    const line = target.closest<SVGElement>('[data-line]');
    if (line) { onSelect(METRO.lines[line.dataset.line as LineKey].group); return; }
    onSelect('root');
  });
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = (e.target as Element).closest('.mt-stn, .mt-top');
    if (!g) return;
    e.preventDefault();
    if (g.classList.contains('mt-top')) go('contact'); else onSelect((g as SVGGElement).dataset.id!);
  });

  render();
  return {
    setFocus(id) {
      sel = id && METRO.stations[id] ? id : null;
      open = id ? lineOf(id) : null;
      apply();
    },
    setViewport(a) {
      const V = METRO.view, k = Math.min(a.w / V.w, a.h / V.h, METRO.maxScale);
      const w = V.w * k, h = V.h * k;
      Object.assign(svg.style, { left: `${a.x + (a.w - w) / 2}px`, top: `${a.y + (a.h - h) / 2}px`, width: `${w}px`, height: `${h}px` });
    },
    refilter: apply,
    rerenderLabels: render,
  };
}
