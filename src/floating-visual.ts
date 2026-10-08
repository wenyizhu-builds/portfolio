/**
 * Things that float beside the map, next to the station they belong to: a case's picture, or (v71.5) an AI project's
 * "Try the prototype" bar. Each takes the clear spot nearest its station — never over a line, a station or a name —
 * so the same case always puts it in the same place (v71.4: not random).
 */
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const cssPx = (name: string) => parseFloat(cssVar(name)) || 0;

export function createFloatingVisual(stage: HTMLElement, side: HTMLElement, open: (src: string, alt: string) => void) {
  const button = document.createElement('button');
  button.className = 'floating-visual';
  button.hidden = true;
  const image = document.createElement('img');
  button.append(image);
  const app = document.createElement('div');
  app.className = 'floating-app';
  app.hidden = true;
  stage.parentElement!.append(button, app);
  let source = '', frame = 0, anchorId = '', appHtml = '';
  type Pos = { x: number; y: number; w: number; h: number };
  let position: Pos | undefined, appPos: Pos | undefined;
  button.onclick = () => open(source, image.alt);
  type Box = { left: number; top: number; right: number; bottom: number };
  const overlaps = (a: Box, b: Box, m = cssPx('--fv-clear')) => a.left < b.right + m && a.right > b.left - m && a.top < b.bottom + m && a.bottom > b.top - m;
  /** The area a floating thing may use: below the header, left of the card, above the legend. */
  const bounds = () => ({
    edge: cssPx('--fv-edge'),
    top: Math.max(cssPx('--fv-top-min'), document.querySelector('.top')!.getBoundingClientRect().bottom + cssPx('--fv-edge')),
    right: Math.min(side.getBoundingClientRect().left - cssPx('--fv-card-gap'), innerWidth - cssPx('--fv-edge')),
    bottom: innerHeight - cssPx('--fv-bottom-room'),
  });

  /** Everything on the map a floating thing must keep clear of. A line's box is mostly empty, so lines are sampled along their length. */
  function obstacles(liveOnly = false, skip?: Element | null): DOMRect[] {
    // the prototype bar may cover faded lines (it's solid white) — and, on a ride, everything the ride doesn't use
    const riding = !!stage.querySelector('.metro.riding');
    const ghost = (el: Element) => el.closest('.faded') || (riding && el.closest('[data-l]') && !el.closest('.on-ride, .on-route'));
    const live = (el: Element) => (!liveOnly || !ghost(el)) && el !== skip;
    const out = [...stage.querySelectorAll('.node, .lk, .mt-stn, .mt-lname, .mt-top')].filter(live).map(el => el.getBoundingClientRect());
    const bar = document.querySelector('.mt-bar.show'); // the ride bar under the header
    if (bar) out.push(bar.getBoundingClientRect());
    stage.querySelectorAll<SVGPathElement>('path.mt-track[data-l]').forEach((path) => {
      if (!live(path)) return;
      const m = path.getScreenCTM(), len = path.getTotalLength(), r = parseFloat(getComputedStyle(path).strokeWidth) || 4;
      if (!m || !len) return;
      for (let s = 0; s <= len; s += 8) {
        const q = path.getPointAtLength(s), x = m.a * q.x + m.c * q.y + m.e, y = m.b * q.x + m.d * q.y + m.f, h = r * m.a;
        out.push(new DOMRect(x - h, y - h, 2 * h, 2 * h));
      }
    });
    return out;
  }
  /** The clear spot nearest the anchor station, trying each size in turn; the upper half first, then anywhere above the legend. */
  function nearest(sizes: [number, number][], cached: Pos | undefined, liveOnly = false): Pos | undefined {
    const { edge, top, right, bottom: lower } = bounds(), step = cssPx('--fv-step');
    const upper = Math.min(innerHeight * 0.5, innerHeight - cssPx('--fv-upper-room'));
    const obs = obstacles(liveOnly);
    const safe = (p: Pos, bottom = lower) => p.x >= edge && p.y >= top && p.x + p.w <= right && p.y + p.h <= bottom
      && !obs.some(o => overlaps({ left: p.x, top: p.y, right: p.x + p.w, bottom: p.y + p.h }, o));
    if (cached && safe(cached)) return cached;
    const st = anchorId ? stage.querySelector(`[data-id="${CSS.escape(anchorId)}"] .mt-dot`)?.getBoundingClientRect() : undefined;
    const ax = st ? st.left + st.width / 2 : 0, ay = st ? st.top + st.height / 2 : top;
    const dist = (p: Pos) => Math.hypot(Math.max(p.x - ax, 0, ax - p.x - p.w), Math.max(p.y - ay, 0, ay - p.y - p.h));
    for (const [w, h] of sizes) {
      for (const bottom of [upper, lower]) {
        let best: Pos | undefined;
        for (let y = top; y + h <= bottom; y += step) {
          for (let x = edge; x + w <= right; x += step) {
            const p = { x, y, w, h };
            if (safe(p, bottom) && (!best || dist(p) < dist(best))) best = p;
          }
        }
        if (best) return best;
      }
    }
    return undefined;
  }
  /** A spot touching the anchor station (its dot and name): to the left, to the right, below, above — the first that's
      free; with `force`, the first that fits on the page even if it covers part of the map (v72.14, owner: right by the dot). */
  function beside(w: number, h: number, force = false): Pos | undefined {
    const g = anchorId ? stage.querySelector(`.mt-stn[data-id="${CSS.escape(anchorId)}"]`) : null, dot = g?.querySelector('.mt-dot');
    if (!g || !dot) return undefined;
    const d = dot.getBoundingClientRect(), s = g.getBoundingClientRect(), cy = d.top + d.height / 2, gap = cssPx('--fv-beside');
    const { edge, top, right, bottom } = bounds(), obs = obstacles(true, g), near = cssPx('--fv-near');
    const ride = document.querySelector('.mt-bar.show')?.getBoundingClientRect(), low = ride ? Math.min(bottom, ride.top - cssPx('--fv-ride-gap')) : bottom;
    const clear = (p: Pos) => p.x >= edge && p.y >= top && p.x + p.w <= right && p.y + p.h <= low
      && (force || !obs.some(o => overlaps({ left: p.x, top: p.y, right: p.x + p.w, bottom: p.y + p.h }, o, near)));
    return [
      { x: s.left - gap - w, y: cy - h / 2 }, // s = the station with its name, so the bar never covers the name
      { x: s.right + gap, y: cy - h / 2 },
      { x: d.left, y: s.bottom + gap },
      { x: d.left, y: s.top - gap - h },
    ].map((p) => ({ ...p, w, h })).find(clear);
  }
  /** The map is still arriving: its lines aren't where they'll end up (animationend reschedules). */
  const arriving = () => stage.getAnimations().some((an) => an.playState === 'running');

  function place() {
    frame = 0;
    const ready = !!stage.clientWidth && !arriving();
    // the picture
    if (!source || !image.naturalWidth || !ready) button.hidden = true;
    else {
      position = nearest(cssVar('--fv-widths').split(/\s+/).map(Number).map((w) => [w, w * image.naturalHeight / image.naturalWidth]), position);
      if (position) Object.assign(button.style, { left: `${position.x}px`, top: `${position.y}px`, width: `${position.w}px` });
      button.hidden = !position;
    }
    // the prototype bar: measured at its natural size, then placed like the picture
    if (!appHtml || !ready) { app.hidden = true; return; }
    app.hidden = false;
    app.style.visibility = 'hidden';
    const w = app.offsetWidth, h = app.offsetHeight;
    // v71.7 (owner: stay close to the dot): right beside its station — left of it, right of its name, below or above —
    // over faded lines if need be (it's solid white), never over the open line or its stations; else the nearest clear spot
    // v72.14 (owner): right by the dot even if it has to cover part of the map — never drifting to a far corner
    appPos = beside(w, h) ?? beside(w, h, true) ?? nearest([[w, h]], appPos, true);
    // never hidden: with no free spot (a small screen on a ride), it sits at the left, just above the ride bar
    const rb = document.querySelector('.mt-bar.show')?.getBoundingClientRect();
    if (!appPos && rb) appPos = { x: rb.left, y: rb.top - cssPx('--fv-ride-gap') - h, w, h };
    // v72.13 (owner): same place as before, only lifted when it would crowd the ride bar below
    const ride = document.querySelector('.mt-bar.show')?.getBoundingClientRect(), lift = cssPx('--fv-ride-gap');
    if (appPos && ride && appPos.y + h > ride.top - lift) appPos = { ...appPos, y: ride.top - lift - h };
    if (appPos) Object.assign(app.style, { left: `${appPos.x}px`, top: `${appPos.y}px` });
    app.style.visibility = '';
    app.hidden = !appPos;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(place); }
  new MutationObserver(schedule).observe(stage, { childList: true, subtree: true, attributes: true });
  new ResizeObserver(schedule).observe(side);
  window.addEventListener('resize', schedule);
  stage.addEventListener('animationend', schedule);
  image.onload = schedule;
  return {
    set(src?: string, alt = '', thumbnail?: string, anchor = '') {
      anchorId = anchor;
      image.alt = alt;
      button.setAttribute('aria-label', `View image: ${alt}`);
      if (source === (src || '')) { schedule(); return; }
      source = src || '';
      position = undefined;
      button.hidden = true;
      if (source) image.src = thumbnail || source;
      schedule();
    },
    /** An AI project's "Try the prototype" bar beside its station ('' hides it). */
    setApp(html: string, anchor = '') {
      anchorId = anchor || anchorId;
      if (html === appHtml) { schedule(); return; }
      appHtml = html;
      app.innerHTML = html;
      appPos = undefined;
      app.hidden = true;
      schedule();
    },
  };
}
