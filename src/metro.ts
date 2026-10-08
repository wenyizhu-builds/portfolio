/* The home map as a metro map (v70–71, branch metro-map; design in docs/SPEC.md, "Rising" and "Curate your ride").
   Same API as map.ts (MapApi), so main.ts only swaps one call. Everything about the drawing —
   where each station sits, the shape of each line, the result tags, the ride's track — lives in METRO below.
   Colours, sizes and durations come from style.css (:root); words from content.ts. */
import { ancestors, byId, ui, type SiteNode } from './content';
import type { MapApi } from './map';
import { lineMark } from './shapes';
import { rideSummary } from './blocks';
import { clearFilters, esc, filtering, filters, go, matches, reducedMotion, t } from './state';

const SVGNS = 'http://www.w3.org/2000/svg';
type Pos = 'left' | 'right' | 'above' | 'below';
type Pt = [number, number];
type LineKey = 'career' | 'campus' | 'creative' | 'paid' | 'social' | 'ai';
export type MarkKind = 'interchange' | 'key' | 'dot';

/* Map units (≈ px at the normal size). The career line rises on a 45° diagonal to ✳ Next stop. */
const METRO = {
  view: { x: 30, y: 100, w: 860, h: 670 }, // the drawing's frame; scaled to fit the free area left of the card
  topLabel: 30, // "Next stop" sits this far above its station
  inkTop: 158, // where the drawing visibly starts (top of the "Next stop" name); the card column lines up with it
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
  /** One meaning per mark (v71): double ring = key case, big ring = interchange (lines meet), small ring = any other stop. */
  key: ['ua-creative-strategy', 'gip-testing', 'zzz-jp-accounts', 'interactive-filter', 'ai-workbench'],
  interchange: ['xjtlu', 'seminary-coop', 'hoyoverse', 'xhs-ai-channel'],
  /** ✳ at the top of the climb; the AI line starts here. Clicking it opens "Let's talk". */
  top: [640, 200] as Pt,
  /** Result tags under key stations (v70.2, owner's pick C): words from content.ts `mapTag`, colour from the station's line. */
  tag: { h: 17, charW: 6.6, padX: 7, gap: 6, textY: 12.2 },
  /** Nudge a tag sideways where a line runs right under it. */
  tagNudge: { 'zzz-jp-accounts': 18 } as Record<string, number>,
  // outer radius, inner radius, outer stroke, inner stroke — "Medium" weight (owner, v71)
  radius: { interchange: [11, 0, 3.1, 0], key: [9.7, 4.2, 2.6, 2.2], dot: [5.2, 0, 2.2, 0], star: 19 } as Record<MarkKind | 'star', number[] | number>,
  labelOff: { interchange: 18, key: 16, dot: 12 } as Record<MarkKind, number>,
  transferBow: 0.28, // a transfer arc bows out by this share of its length (at least transferMin)
  transferMin: 34,
  /** A ride runs one way, like a train: down the Paid & UA line (or up the Career line) to HoYoverse,
      out along Creator & Social to Xiaohongshu, then up the AI line towards ✳. Stops are numbered in that order. */
  route: { paid: [[200, 160], [440, 160], [500, 220]] as Pt[], career: [[140, 700]] as Pt[], tail: [[500, 340], [580, 420], [580, 600], [640, 660], [760, 660], [760, 320], [640, 200]] as Pt[] },
  routeSnap: 12, // a station counts as on the route within this distance (bends are rounded)
  routeStep: 1.5, // sampling step along the route
  /** Stop numbers: small rounded squares beside the station, on the side away from its name. */
  stopNo: { side: 15, rise: 14, below: 17, w: 14, w2: 18, h: 14, rx: 3, textY: 3.4, pop: 0.045 },
  /** Confetti at the end of the line: the map's own pieces (track dashes, rings, ✳), light and slow. */
  confetti: { n: 34, speed: 3.2, speedVar: 4, spread: 1.1, gravity: 0.09, maxFall: 1.6, dragX: 0.975, dragY: 0.985, sway: 0.35, swayPeriod: 260, size: 3, sizeVar: 2.5, spin: 0.12, alpha: 0.85, fadeFrom: 0.45, scale: 1.4 },
};

const f = (v: number) => v.toFixed(1);
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const cssMs = (name: string) => parseFloat(cssVar(name)) || 0;
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
function label(x: number, y: number, lines: string[], pos: Pos, cls: string, off: number, tag?: { text: string; line: LineKey; dx: number }): string {
  const lh = METRO.lineH, n = lines.length;
  const [tx, ty, a] = ({
    right: [off, 4.5 - (n - 1) * lh / 2, 'start'], left: [-off, 4.5 - (n - 1) * lh / 2, 'end'],
    above: [0, -off - (n - 1) * lh, 'middle'], below: [0, off + 9, 'middle'],
  } as const)[pos];
  const tsp = lines.map((l, i) => `<tspan x="${tx}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('');
  let pill = '';
  if (tag) { // a pill under the name, aligned with it
    const T = METRO.tag, w = tag.text.length * T.charW + 2 * T.padX, top = ty + (n - 1) * lh + T.gap, x0 = (a === 'end' ? tx - w : a === 'middle' ? tx - w / 2 : tx) + tag.dx;
    pill = `<g class="mt-tag tag-${tag.line}"><rect x="${f(x0)}" y="${f(top)}" width="${f(w)}" height="${T.h}" rx="${T.h / 2}"/><text x="${f(x0 + w / 2)}" y="${f(top + T.textY)}" text-anchor="middle">${esc(tag.text)}</text></g>`;
  }
  return `<g class="mt-name" transform="translate(${f(x)},${f(y)})"><text class="mt-halo ${cls}" text-anchor="${a}" y="${ty}">${tsp}</text><text class="${cls}" text-anchor="${a}" y="${ty}">${tsp}</text>${pill}</g>`;
}
/** Which line a node opens: its station's first line; groups map to their line. */
function lineOf(id: string): LineKey | null {
  const st = METRO.stations[id];
  if (st) return st[2].split(' ')[0] as LineKey;
  const hit = (Object.keys(METRO.lines) as LineKey[]).find((k) => METRO.lines[k].group === id);
  if (hit) return hit;
  return id === 'info' ? 'career' : null;
}
/** The one decision point for a station's mark (map, legend, card lists — L17). */
export function markKindOf(id: string): MarkKind {
  return METRO.interchange.includes(id) ? 'interchange' : METRO.key.includes(id) ? 'key' : 'dot';
}
const isStation = (id: string) => !!METRO.stations[id];
const isPlace = (n: SiteNode | undefined) => !!n && (n.type === 'role' || n.type === 'school');
/** The station mark as a small standalone <svg>, for the legend and the card's lists. */
export function stationMark(kind: MarkKind, px = 14): string {
  const [ro, ri, so, si] = METRO.radius[kind] as number[];
  const box = (METRO.radius.interchange as number[])[0] + (METRO.radius.interchange as number[])[2];
  return `<svg class="mt-mark" width="${px}" height="${px}" viewBox="${-box} ${-box} ${2 * box} ${2 * box}" aria-hidden="true"><circle class="mt-ring" r="${ro}" stroke-width="${so}"/>${ri ? `<circle class="mt-inner" r="${ri}" stroke-width="${si}"/>` : ''}</svg>`;
}
/** A list row's mark: the station mark for anything on the map, nothing otherwise. */
export function listMark(id: string): string {
  return isStation(id) ? stationMark(markKindOf(id)) : '';
}

/** The line a node belongs to, for the card's and the phone's marks (one decision point with the map, L17):
    a station's first line, a group's line, or the line of the group it sits in. Information and ✳ have none. */
export function lineKeyOf(id: string): LineKey | null {
  for (const a of [id, ...ancestors(id)]) {
    const k = lineOf(a);
    if (k && a !== 'info') return k;
  }
  return null;
}

/** The mark a card or phone heading shows for a node: its line, with a station for a single item. */
export function markFor(id: string, px = 14): string {
  const n = byId.get(id);
  return lineMark(lineKeyOf(id), !!n && !['branch', 'sub', 'root'].includes(n.type), px);
}

export function createMetro(host: HTMLElement, onSelect: (id: string) => void): MapApi {
  const svg = el('svg', { class: 'metro', role: 'group' });
  host.appendChild(svg);
  const desk = host.parentElement!;
  let open: LineKey | null = null, sel: string | null = null;

  /* ---------- the ride (v71): state ---------- */
  const bar = document.createElement('div');
  bar.className = 'mt-bar';
  desk.appendChild(bar);
  let rideKey = '', rideStep = -1, lastStep = -1, endState = '';
  let order: string[] = [], at: Record<string, number> = {}, routeEl: SVGPathElement | null = null, builtKey = '';
  let trainAt: number | null = null, raf = 0, travelMs = 0, arriveT = 0, inkTop = 0;

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
    // ✳ Next stop
    const [tx, ty] = METRO.top;
    const arms = [0, 1, 2, 3].map((i) => { const a = i * Math.PI / 4, X = 10 * Math.cos(a), Y = 10 * Math.sin(a); return `<line x1="${f(-X)}" y1="${f(-Y)}" x2="${f(X)}" y2="${f(Y)}"/>`; }).join('');
    // v71.1 (owner): just "Next stop", on a dotted ring — a station still being built
    const topText = esc(t(ui.nextStop));
    s += `<g class="mt-top" data-l="career ai" role="link" tabindex="0" aria-label="${topText}"><circle class="mt-ring mt-open" cx="${tx}" cy="${ty}" r="${METRO.radius.star}"/><g class="mt-star" transform="translate(${tx},${ty})">${arms}</g>`
      + `<g transform="translate(${tx},${ty - METRO.topLabel})"><text class="mt-halo mt-lbl b" text-anchor="middle">${topText}</text><text class="mt-lbl b" text-anchor="middle">${topText}</text></g></g>`;
    s += '<g class="mt-xfer"></g>';
    // the ride's own track, in each line's colour, shown through two masks: the whole ride (pale ahead) and the part travelled
    const copies = keys.filter((k) => k !== 'campus').map((k) => `<path class="mt-track l-${k}" d="${trackPath(METRO.lines[k].track)}"/>`).join('');
    s += `<g class="mt-ride"><defs><mask id="mt-m-all" maskUnits="userSpaceOnUse"><path class="mt-rmask" id="mt-r-all"/></mask><mask id="mt-m-done" maskUnits="userSpaceOnUse"><path class="mt-rmask" id="mt-r-done"/></mask></defs>`
      + `<g class="mt-ahead" mask="url(#mt-m-all)">${copies}</g><g mask="url(#mt-m-done)">${copies}</g></g>`;
    for (const [id, [x, y, lines, pos]] of Object.entries(METRO.stations)) {
      const n = byId.get(id);
      if (!n) continue;
      s += station(n, x, y, lines, pos);
    }
    svg.innerHTML = s;
    builtKey = ''; // the ride's numbers and route are rebuilt on the fresh drawing
    apply();
  }

  function station(n: SiteNode, x: number, y: number, lines: string, pos: Pos): string {
    const kind = markKindOf(n.id);
    const [ro, ri, so, si] = METRO.radius[kind] as number[];
    const mark = `<g class="mt-dot"><circle class="mt-ring" cx="${x}" cy="${y}" r="${ro}" stroke-width="${so}"/>${ri ? `<circle class="mt-inner" cx="${x}" cy="${y}" r="${ri}" stroke-width="${si}"/>` : ''}</g>`;
    const place = isPlace(n);
    const words = place ? [t(n.mapLabel ?? n.label)] : wrap(t(n.mapLabel ?? n.label));
    // the name follows the mark: key cases and interchanges bold, other stops regular; all ink (owner, v71)
    const cls = kind === 'dot' ? 'mt-lbl' : 'mt-lbl b';
    const tag = n.mapTag ? { text: t(n.mapTag), line: lines.split(' ')[0] as LineKey, dx: METRO.tagNudge[n.id] ?? 0 } : undefined;
    const name = label(x, y, words, pos, cls, METRO.labelOff[kind], tag);
    const quiet = kind === 'dot' && !place; // other work: named on hover or when its line is open
    return `<g class="mt-stn" data-id="${n.id}" data-l="${lines}" tabindex="0" role="button" aria-label="${esc(t(n.label))}">${mark}${quiet ? `<g class="mt-more">${name}</g>` : name}</g>`;
  }

  /* ---------- the ride: which stations, in which order ---------- */
  /** The stations a ride stops at: a ready-made ride's own list (places included); otherwise only pieces of work. */
  function rideIds(): string[] | null {
    if (!filtering()) return null;
    return Object.keys(METRO.stations).filter((id) => matches(id) && (!!filters.ride || !isPlace(byId.get(id))));
  }
  /** Lay the one-way route under the ride and number its stations by how far along it they sit. */
  function buildRoute(ids: string[]) {
    routeEl?.remove();
    routeEl = null; order = []; at = {};
    if (!ids.length) return;
    const fromCareer = ids.some((id) => id !== 'hoyoverse' && METRO.stations[id][2].split(' ').includes('career'));
    const R = METRO.route, d = trackPath([...(fromCareer ? R.career : R.paid), ...R.tail]);
    routeEl = el('path', { d, class: 'mt-route' });
    svg.appendChild(routeEl);
    const len = routeEl.getTotalLength(), samples: [number, number, number][] = [];
    for (let s = 0; s <= len; s += METRO.routeStep) { const q = routeEl.getPointAtLength(s); samples.push([s, q.x, q.y]); }
    for (const id of ids) {
      const [x, y] = METRO.stations[id];
      let best = [Infinity, 0];
      for (const [s, px, py] of samples) { const dd = Math.hypot(px - x, py - y); if (dd < best[0]) best = [dd, s]; }
      if (best[0] < METRO.routeSnap) at[id] = best[1];
    }
    order = ids.filter((id) => id in at).sort((a, b) => at[a] - at[b]);
  }
  /** Numbers beside the stations, popping in one after another. */
  function drawNumbers() {
    svg.querySelectorAll('.mt-no').forEach((e) => e.remove());
    const N = METRO.stopNo;
    order.forEach((id, i) => {
      const [x, y, , pos] = METRO.stations[id], g = svg.querySelector(`.mt-stn[data-id="${CSS.escape(id)}"]`);
      if (!g) return;
      const vert = pos === 'above' || pos === 'below', w = i + 1 > 9 ? N.w2 : N.w;
      const cx = vert ? x : x + (pos === 'left' ? N.side : -N.side), cy = vert ? y + (pos === 'above' ? N.below : -N.below) : y - N.rise;
      g.insertAdjacentHTML('beforeend', `<g class="mt-no pop" style="--d:${(i * N.pop).toFixed(3)}s"><rect x="${f(cx - w / 2)}" y="${f(cy - N.h / 2)}" width="${w}" height="${N.h}" rx="${N.rx}"/><text x="${f(cx)}" y="${f(cy + N.textY)}" text-anchor="middle">${i + 1}</text></g>`);
    });
  }
  const seg = (a: number, b: number) => (b - a < 0.5 ? 'opacity:0' : `stroke-dasharray:${f(b - a)} 99999;stroke-dashoffset:${f(-a)}`);
  /** Grow the travelled track to this point along the route; runs only while it moves (L4). */
  function advance(to: number) {
    const done = svg.querySelector('#mt-r-done');
    if (!done || !order.length) return;
    const from = trainAt ?? to, start = at[order[0]];
    const dur = reducedMotion.matches ? 0 : Math.min(cssMs('--m-ride-max'), cssMs('--m-ride-min') + Math.abs(to - from) * cssMs('--m-ride-per'));
    travelMs = dur;
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = (now: number) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2, s = from + (to - from) * e;
      done.setAttribute('style', seg(start, s));
      if (k < 1) raf = requestAnimationFrame(step); else trainAt = to;
    };
    raf = requestAnimationFrame(step);
  }

  /* ---------- the ride bar: one fixed-size bar; only its words change ---------- */
  bar.innerHTML = `<button type="button" class="pv" data-ride="prev"></button><button type="button" class="nx" data-ride="go"><span></span></button><div class="board" aria-live="polite"></div><button type="button" class="ex" data-ride="exit"></button>`;
  const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
  /** Swap a block of text like a departures board: the old row slides out, the new one in (backwards when going back). */
  function swapRow(html: string, dir: number) {
    const board = bar.querySelector<HTMLElement>('.board')!, old = board.querySelector<HTMLElement>('.row:not(.out)');
    if (old && old.dataset.html === html) return;
    const row = document.createElement('div');
    row.className = 'row'; row.innerHTML = html; row.dataset.html = html;
    board.appendChild(row);
    if (!old || reducedMotion.matches) { old?.remove(); return; }
    const y = dir < 0 ? -1 : 1, opt = { duration: cssMs('--m-board'), easing: cssVar('--ease') };
    old.classList.add('out');
    old.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-55 * y}%)`, opacity: 0 }], opt).onfinish = () => old.remove();
    row.animate([{ transform: `translateY(${55 * y}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], opt);
  }
  function swapLabel(text: string) {
    const sp = bar.querySelector<HTMLElement>('.nx span')!;
    if (sp.textContent === text) return;
    if (reducedMotion.matches || !sp.textContent) { sp.textContent = text; return; }
    const half = cssMs('--m-board') / 3;
    sp.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-40%)' }], { duration: half, easing: 'ease-in' }).onfinish = () => {
      sp.textContent = text;
      sp.animate([{ opacity: 0, transform: 'translateY(40%)' }, { opacity: 1, transform: 'none' }], { duration: 2 * half, easing: cssVar('--ease') });
    };
  }
  function paintBar(dir: number) {
    const riding = filtering();
    bar.classList.toggle('show', riding);
    desk.classList.toggle('riding', riding);
    if (!riding) return;
    const n = order.length, last = rideStep === n - 1, arrived = last && endState === `${rideKey}#${rideStep}`;
    bar.classList.toggle('started', rideStep >= 0);
    bar.classList.toggle('empty', !n);
    bar.classList.toggle('ending', last && !arrived);
    bar.classList.toggle('arrived', arrived);
    const pv = bar.querySelector<HTMLButtonElement>('.pv')!, ex = bar.querySelector<HTMLButtonElement>('.ex')!;
    pv.disabled = rideStep <= 0; pv.textContent = '←'; pv.setAttribute('aria-label', t(ui.ridePrev));
    ex.textContent = '×'; ex.setAttribute('aria-label', t(ui.rideExit));
    swapLabel(t(rideStep < 0 ? ui.rideStart : arrived ? ui.rideTalk : last ? ui.rideArriving : ui.rideNext));
    const count = n === 1 ? t(ui.rideStop1) : fill(t(ui.rideStops), { n });
    const sum = rideSummary();
    const two = (a: string, b: string) => `<span>${esc(a)}</span><span>${esc(b)}</span>`;
    swapRow(!n ? two(t(ui.rideNone), t(ui.rideNoneHint))
      : rideStep < 0 ? two(t(ui.yourRide), sum ? `${count} · ${sum}` : count)
      : arrived ? two(t(ui.rideEnd), fill(t(ui.rideThanks), { n }))
      : two(t(byId.get(order[rideStep])!.label), `${fill(t(ui.rideOf), { i: rideStep + 1, n })} · ${last ? t(ui.rideLast) : fill(t(ui.rideNextUp), { name: t(byId.get(order[rideStep + 1])!.label) })}`), dir);
  }
  bar.addEventListener('click', (e) => {
    const act = (e.target as Element).closest<HTMLElement>('[data-ride]')?.dataset.ride;
    if (!act || !order.length) { if (act === 'exit') { clearFilters(); go(''); } return; }
    if (act === 'exit') { clearFilters(); go(''); return; }
    if (act === 'go' && bar.classList.contains('arrived')) { clearFilters(); go('contact'); return; } // the last stop's button is Let's talk
    rideStep = Math.max(0, Math.min(order.length - 1, rideStep + (act === 'go' ? 1 : -1)));
    go(order[rideStep]); // the card opens the stop; setFocus brings us back to apply()
  });

  /* ---------- the end of the line ---------- */
  function arrive(id: string) {
    const g = svg.querySelector<SVGGElement>(`.mt-stn[data-id="${CSS.escape(id)}"]`);
    if (!g) return;
    g.classList.remove('arrive'); void g.getBBox(); g.classList.add('arrive');
    const dot = g.querySelector('.mt-dot')!.getBoundingClientRect(), shown = dot.width > 0 && getComputedStyle(host).visibility !== 'hidden' && Number(getComputedStyle(host).opacity) > 0;
    if (!reducedMotion.matches) confetti(shown ? dot : bar.querySelector('.nx')!.getBoundingClientRect()); // the map may be hidden behind a case's video
  }
  /** Light, warm confetti made of the map's own pieces; the canvas removes itself when it's done. */
  function confetti(from: DOMRect) {
    const C = METRO.confetti, dr = desk.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    const cv = document.createElement('canvas');
    cv.className = 'mt-confetti'; cv.width = dr.width * dpr; cv.height = dr.height * dpr;
    desk.appendChild(cv);
    const g = cv.getContext('2d')!;
    g.scale(dpr, dpr);
    // warm set, all derived from the base colours: the orange note colour, lime, their mixes and the paper
    const hex = (x: string) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
    const mix = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
    const NOTE = cssVar('--note'), LIME = cssVar('--accent'), PAPER = cssVar('--bg'), WHITE = cssVar('--panel');
    const cols = [NOTE, mix(NOTE, LIME, 0.45), mix(NOTE, PAPER, 0.4), LIME, mix(NOTE, LIME, 0.7)], star = mix(NOTE, LIME, 0.3);
    const u = Math.max(svg.getBoundingClientRect().width / METRO.view.w, 1) * C.scale;
    const ox = from.left + from.width / 2 - dr.left, oy = from.top + from.height / 2 - dr.top;
    const P = Array.from({ length: C.n }, (_, i) => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * C.spread, v = (C.speed + Math.random() * C.speedVar) * u;
      return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * C.spin,
        k: i % 8 === 0 ? 'star' : i % 3 === 0 ? 'ring' : 'dash', c: cols[i % cols.length], s: (C.size + Math.random() * C.sizeVar) * u, ph: Math.random() * 6.28 };
    });
    const life = cssMs('--m-confetti'), t0 = performance.now();
    const frame = (now: number) => {
      const tt = now - t0;
      g.clearRect(0, 0, dr.width, dr.height);
      g.globalAlpha = C.alpha * Math.max(0, 1 - Math.max(0, tt - life * C.fadeFrom) / (life * (1 - C.fadeFrom)));
      g.lineCap = 'round';
      for (const p of P) {
        p.vy = Math.min(p.vy + C.gravity * u, C.maxFall * u); p.vx *= C.dragX; p.vy *= C.dragY;
        p.x += p.vx + Math.sin(tt / C.swayPeriod + p.ph) * C.sway * u; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.strokeStyle = p.c;
        g.beginPath();
        if (p.k === 'dash') { g.lineWidth = p.s * 0.42; g.moveTo(-p.s, 0); g.lineTo(p.s, 0); g.stroke(); }
        else if (p.k === 'ring') { g.lineWidth = p.s * 0.26; g.fillStyle = WHITE; g.arc(0, 0, p.s * 0.55, 0, 6.29); g.fill(); g.stroke(); }
        else { g.strokeStyle = star; g.lineWidth = p.s * 0.24; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; g.moveTo(-Math.cos(a) * p.s, -Math.sin(a) * p.s); g.lineTo(Math.cos(a) * p.s, Math.sin(a) * p.s); } g.stroke(); }
        g.restore();
      }
      if (tt < life) requestAnimationFrame(frame); else cv.remove();
    };
    requestAnimationFrame(frame);
  }

  /** Fade, name and highlight to match the current focus, the open line and the ride. */
  function apply() {
    const ids = rideIds(), riding = !!ids;
    const key = riding ? JSON.stringify(filters) : '';
    if (key !== rideKey) { rideKey = key; rideStep = -1; lastStep = -1; trainAt = null; endState = ''; }
    if (riding && builtKey !== key) { buildRoute(ids!); drawNumbers(); builtKey = key; }
    if (!riding && builtKey) { routeEl?.remove(); routeEl = null; order = []; builtKey = ''; svg.querySelectorAll('.mt-no').forEach((e) => e.remove()); }
    if (riding && sel && order.includes(sel) && rideStep >= 0) rideStep = order.indexOf(sel); // a stop clicked on the map
    const cur = riding && rideStep >= 0 ? order[rideStep] : null;

    const rel = sel && !riding ? (byId.get(sel)?.related ?? []) : [];
    svg.classList.toggle('riding', riding);
    svg.classList.toggle('started', riding && rideStep >= 0);
    svg.querySelectorAll<SVGElement>('[data-l]').forEach((e) => {
      const on = riding || !open || e.dataset.l!.split(' ').includes(open) || rel.includes(e.dataset.id ?? '');
      e.classList.toggle('faded', !on);
    });
    svg.querySelectorAll<SVGGElement>('.mt-stn').forEach((g) => {
      const id = g.dataset.id!, lines = g.dataset.l!.split(' '), onRide = order.includes(id);
      g.classList.toggle('sel', id === sel);
      g.classList.toggle('rel', rel.includes(id));
      g.classList.toggle('on-ride', riding && onRide);
      g.classList.toggle('cur', id === cur);
      g.querySelector('.mt-more')?.classList.toggle('on', (!!open && lines.includes(open)) || rel.includes(id) || (riding && onRide));
      const no = g.querySelector('.mt-no');
      if (no) {
        const i = order.indexOf(id);
        no.classList.toggle('past', rideStep >= 0 && i < rideStep);
        no.classList.toggle('now', i === rideStep);
      }
    });
    svg.querySelector('.mt-xfer')!.innerHTML = sel && !riding ? rel.map((r) => transfer(sel!, r)).join('') : '';

    // the ride's track: all of it pale ahead, the travelled part growing to the current stop
    const all = svg.querySelector('#mt-r-all'), done = svg.querySelector('#mt-r-done');
    if (all && done) {
      if (riding && routeEl && order.length) {
        const d = routeEl.getAttribute('d')!;
        all.setAttribute('d', d); done.setAttribute('d', d);
        all.setAttribute('style', seg(at[order[0]], at[order[order.length - 1]]));
        if (rideStep >= 0) {
          if (rideStep !== lastStep || trainAt === null) advance(at[order[rideStep]]);
          else done.setAttribute('style', seg(at[order[0]], trainAt));
        } else done.setAttribute('style', 'opacity:0');
      } else { all.setAttribute('d', ''); done.setAttribute('d', ''); }
    }
    // the last stop: a beat while the line pulls in, then the arrival (no frozen grey button: it fills while it waits)
    if (riding && rideStep === order.length - 1 && rideStep >= 0 && lastStep !== rideStep) {
      const k = `${rideKey}#${rideStep}`, id = order[rideStep], wait = reducedMotion.matches ? 0 : Math.min(travelMs, cssMs('--m-arrive-max'));
      bar.style.setProperty('--arrive', `${wait}ms`);
      clearTimeout(arriveT);
      arriveT = window.setTimeout(() => { if (rideKey + '#' + rideStep === k) { endState = k; paintBar(1); arrive(id); } }, wait);
    }
    paintBar(rideStep < lastStep ? -1 : 1);
    lastStep = rideStep;
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
    if (stn) {
      const id = stn.dataset.id!;
      if (filtering() && rideStep >= 0 && order.includes(id)) { rideStep = order.indexOf(id); go(id); return; } // hop to a stop on the ride
      onSelect(id);
      return;
    }
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
      inkTop = a.y + (a.h - h) / 2 + (METRO.inkTop - V.y) * k;
    },
    topEdge: () => inkTop,
    refilter: apply,
    rerenderLabels: render,
  };
}
