/**
 * Things that float beside the map, next to the station they belong to: a case's picture, or (v71.5) an AI project's
 * "Try the prototype" bar. Each takes the clear spot nearest its station — never over a line, a station or a name —
 * so the same case always puts it in the same place (v71.4: not random).
 */
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
  const overlaps = (a: Box, b: Box) => a.left < b.right + 22 && a.right > b.left - 22 && a.top < b.bottom + 22 && a.bottom > b.top - 22;

  /** Everything on the map a floating thing must keep clear of. A line's box is mostly empty, so lines are sampled along their length. */
  function obstacles(liveOnly = false): DOMRect[] {
    const live = (el: Element) => !liveOnly || !el.closest('.faded'); // the prototype bar may cover faded lines: it's solid white
    const out = [...stage.querySelectorAll('.node, .lk, .mt-stn, .mt-lname, .mt-top')].filter(live).map(el => el.getBoundingClientRect());
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
    const top = Math.max(100, document.querySelector('.top')!.getBoundingClientRect().bottom + 24);
    const right = Math.min(side.getBoundingClientRect().left - 28, innerWidth - 24);
    const upper = Math.min(innerHeight * 0.5, innerHeight - 90), lower = innerHeight - 110;
    const obs = obstacles(liveOnly);
    const safe = (p: Pos, bottom = lower) => p.x >= 24 && p.y >= top && p.x + p.w <= right && p.y + p.h <= bottom
      && !obs.some(o => overlaps({ left: p.x, top: p.y, right: p.x + p.w, bottom: p.y + p.h }, o));
    if (cached && safe(cached)) return cached;
    const st = anchorId ? stage.querySelector(`[data-id="${CSS.escape(anchorId)}"] .mt-dot`)?.getBoundingClientRect() : undefined;
    const ax = st ? st.left + st.width / 2 : 0, ay = st ? st.top + st.height / 2 : top;
    const dist = (p: Pos) => Math.hypot(Math.max(p.x - ax, 0, ax - p.x - p.w), Math.max(p.y - ay, 0, ay - p.y - p.h));
    for (const [w, h] of sizes) {
      for (const bottom of [upper, lower]) {
        let best: Pos | undefined;
        for (let y = top; y + h <= bottom; y += 20) {
          for (let x = 24; x + w <= right; x += 20) {
            const p = { x, y, w, h };
            if (safe(p, bottom) && (!best || dist(p) < dist(best))) best = p;
          }
        }
        if (best) return best;
      }
    }
    return undefined;
  }
  /** The map is still arriving: its lines aren't where they'll end up (animationend reschedules). */
  const arriving = () => stage.getAnimations().some((an) => an.playState === 'running');

  function place() {
    frame = 0;
    const ready = !!stage.clientWidth && !arriving();
    // the picture
    if (!source || !image.naturalWidth || !ready) button.hidden = true;
    else {
      position = nearest([260, 220, 180, 150].map((w) => [w, w * image.naturalHeight / image.naturalWidth]), position);
      if (position) Object.assign(button.style, { left: `${position.x}px`, top: `${position.y}px`, width: `${position.w}px` });
      button.hidden = !position;
    }
    // the prototype bar: measured at its natural size, then placed like the picture
    if (!appHtml || !ready) { app.hidden = true; return; }
    app.hidden = false;
    app.style.visibility = 'hidden';
    const w = app.offsetWidth, h = app.offsetHeight;
    appPos = nearest([[w, h]], appPos, true);
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
