import { card, site, ui } from './content';
import { esc, reducedMotion, t } from './state';

/*
 * The travel card (v76, owner). Opened only through lightbox.ts (L44: one overlay). It leans toward the
 * cursor and catches the light; a click, a drag or the arrow keys turn it over. Animation runs only while
 * something moves (L4); every end of a drag goes through one function (L5).
 */
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const cssNum = (name: string) => parseFloat(cssVar(name)) || 0;
const cssMs = (name: string) => { const v = cssVar(name), n = parseFloat(v) || 0; return /\ds$/.test(v) ? n * 1000 : n; };
const touchOnly = window.matchMedia('(hover: none)');
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** The front's line, drawn once in a 1000 × 630 box (the card's shape), so it scales with the card. */
function line(): string {
  const [a, b, c] = card.stops.map((s) => esc(t(s)));
  const path = 'M -20 360 H 250 L 350 260 H 590 L 690 160 H 860';
  return `<svg class="tc-line" viewBox="0 0 1000 630" aria-hidden="true"><defs>
    <linearGradient id="tc-grad" x1="0" x2="1"><stop offset="0" class="tc-g0"/><stop offset=".55" class="tc-g1"/><stop offset="1" class="tc-g2"/></linearGradient>
    <filter id="tc-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <path class="tc-glow" d="${path}" stroke="url(#tc-grad)" filter="url(#tc-blur)"/>
    <path class="tc-track" d="${path}" stroke="url(#tc-grad)"/>
    <circle class="tc-stop" cx="160" cy="360" r="13"/><circle class="tc-stop" cx="480" cy="260" r="13"/>
    <circle class="tc-end tc-halo" cx="860" cy="160" r="16"/><circle class="tc-end tc-soft" cx="860" cy="160" r="34"/><circle class="tc-end" cx="860" cy="160" r="16"/>
    <text class="tc-name" x="110" y="450">${a}</text><text class="tc-name" x="440" y="350">${b}</text><text class="tc-goal" x="905" y="268">${c}</text></svg>`;
}

export function cardHtml(): string {
  const stats = card.stats.map((s) => {
    const big = esc(s.big).replace(/([+·])/g, '<em>$1</em>');
    return `<div class="tc-stat${s.oneLine ? ' is-one' : ''}"><b>${big}</b><span>${esc(t(s.label))}<br><i>${esc(t(s.sub))}</i></span></div>`;
  }).join('');
  return `<div class="tc-holder"><div class="tc-lift"><div class="tc-flip" tabindex="0" role="button" aria-label="${esc(t(ui.cardLabel))}">
    <div class="tc-face"><div class="tc-box"><div class="tc tc-f">
      <div class="tc-top"><span>${esc(t(card.line))}</span><span class="tc-ast" aria-hidden="true">✳</span></div>
      ${line()}
      <div class="tc-foot"><b>${esc(site.name)}</b><span>${esc(t(site.tag))}</span></div>
      <div class="tc-glare"></div>
    </div></div></div>
    <div class="tc-face tc-back"><div class="tc-box"><div class="tc tc-b">
      <div class="tc-bh">${esc(t(card.backTitle))}</div>
      <div class="tc-stats">${stats}</div>
      <div class="tc-qr"><img src="${esc(card.qr)}" alt="" draggable="false"/><span>${esc(t(card.scan))}</span></div>
      <div class="tc-bf"><span>${esc(site.email)}</span><span>${esc(bare(site.linkedin))}</span></div>
    </div></div></div>
  </div></div></div>`;
}

export const cardHint = () => t(touchOnly.matches ? ui.cardHintTouch : ui.cardHint);

/** Bring the card to life inside `root` (the lightbox). Returns a function that stops everything. */
export function wireCard(root: HTMLElement): () => void {
  const flip = root.querySelector<HTMLElement>('.tc-flip')!, lift = root.querySelector<HTMLElement>('.tc-lift')!;
  const tiltX = cssNum('--tc-tilt-x'), tiltY = cssNum('--tc-tilt-y'), dragK = cssNum('--tc-drag'), flick = cssNum('--tc-flick'), peek = cssNum('--tc-peek');
  const s = { rx: 0, ry: 0, trx: 0, try: 0, base: 0, go: 0, tgo: 0 };
  let raf = 0, touched = false, alive = true;
  let drag: { x0: number; y0: number; t: number; lastX: number; v: number; moved: boolean; onCard: boolean } | null = null;
  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => alive && fn(), ms));

  function frame() {
    const k = drag ? 0.6 : 0.14;
    s.rx += (s.trx - s.rx) * k; s.ry += (s.try - s.ry) * k; s.go += (s.tgo - s.go) * 0.15;
    flip.style.transform = `rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)`;
    flip.style.setProperty('--go', s.go.toFixed(3));
    const moving = Math.abs(s.trx - s.rx) > 0.05 || Math.abs(s.try - s.ry) > 0.05 || Math.abs(s.tgo - s.go) > 0.005;
    raf = moving && alive ? requestAnimationFrame(frame) : 0; // nothing runs once it settles (L4)
  }
  const kick = () => { if (!raf && alive) raf = requestAnimationFrame(frame); };
  const light = (px: number, py: number) => { flip.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`); flip.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`); };
  const turn = (dir: number) => { touched = true; s.base += 180 * dir; s.try = s.base; s.trx = 0; kick(); };
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const hover = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || drag) return;
    const r = flip.getBoundingClientRect(), px = clamp((e.clientX - r.left) / r.width, -0.6, 1.6), py = clamp((e.clientY - r.top) / r.height, -0.6, 1.6);
    s.trx = -(py - 0.5) * tiltX; s.try = s.base + (px - 0.5) * tiltY; s.tgo = 1; light(px, py); kick();
  };
  const rest = () => { if (drag) return; s.trx = 0; s.try = s.base; s.tgo = 0; kick(); };
  root.addEventListener('pointermove', hover);
  root.addEventListener('pointerleave', rest);

  // v76.1 (owner: "almost impossible to drag"): a drag can start anywhere in the overlay, not only on the card;
  // the card follows the pointer closely; half a turn needs only --tc-turn degrees of drag (or a flick).
  let justDragged = false;
  root.addEventListener('pointerdown', (e) => {
    if ((e.target as Element).closest('button, a') || e.button > 0) return;
    touched = true;
    drag = { x0: e.clientX, y0: e.clientY, t: performance.now(), lastX: e.clientX, v: 0, moved: false, onCard: flip.contains(e.target as Node) };
  });
  root.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) > cssNum('--tc-slop')) { drag.moved = true; root.setPointerCapture(e.pointerId); } // capture only a real drag, so a plain click stays a click
    if (!drag.moved) return;
    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.t); drag.lastX = e.clientX; drag.t = now;
    s.try = s.base + dx * dragK; s.trx = clamp(-dy * 0.08, -tiltX, tiltX); s.tgo = 1;
    light(0.5 + Math.sin((s.try % 360) * Math.PI / 180) * 0.6, 0.3); kick();
  });
  // one end for up / cancel / lost capture (L5)
  const end = (e: PointerEvent) => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.moved) { if (e.type === 'pointerup' && d.onCard) turn(1); return; } // a plain click on the card turns it over; elsewhere it closes (lightbox.ts)
    justDragged = true; setTimeout(() => (justDragged = false));
    const pushed = s.try - s.base + d.v * flick, sign = Math.sign(pushed);
    s.base += sign * 180 * Math.floor((Math.abs(pushed) + 180 - cssNum('--tc-turn')) / 180);
    s.try = s.base; s.trx = 0; s.tgo = e.pointerType === 'mouse' ? 1 : 0; kick();
  };
  (['pointerup', 'pointercancel', 'lostpointercapture'] as const).forEach((type) => root.addEventListener(type, end));
  // a drag that ends off the card is not a click on the backdrop
  root.addEventListener('click', (e) => { if (justDragged) e.stopImmediatePropagation(); }, true);
  flip.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
  });

  // it swings in, then peeks at its back once, unless someone has already touched it
  if (!reducedMotion.matches) {
    lift.animate([{ transform: cssVar('--tc-enter'), opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: cssMs('--tc-swing'), easing: cssVar('--tc-spring') });
    later(() => {
      if (touched) return;
      s.try = peek; s.tgo = 0.6; kick();
      later(() => { if (!touched) { s.try = 0; s.tgo = 0; kick(); } }, cssMs('--tc-peek-hold'));
    }, cssMs('--tc-peek-at'));
  }
  return () => { alive = false; timers.forEach(clearTimeout); cancelAnimationFrame(raf); root.removeEventListener('pointermove', hover); root.removeEventListener('pointerleave', rest); };
}
