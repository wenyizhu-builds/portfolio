/** An image can occupy only verified whitespace to the left of the entire card column. */
export function createFloatingVisual(stage: HTMLElement, side: HTMLElement, open: (src: string, alt: string) => void) {
  const button = document.createElement('button');
  button.className = 'floating-visual';
  button.hidden = true;
  const image = document.createElement('img');
  button.append(image);
  stage.parentElement!.append(button);
  let source = '', frame = 0;
  let position: { x: number; y: number; w: number; h: number } | undefined;
  button.onclick = () => open(source, image.alt);
  type Box = { left: number; top: number; right: number; bottom: number };
  const overlaps = (a: Box, b: Box) => a.left < b.right + 22 && a.right > b.left - 22 && a.top < b.bottom + 22 && a.bottom > b.top - 22;
  function place() {
    frame = 0;
    if (!source || !image.naturalWidth || !stage.clientWidth) { button.hidden = true; return; }
    const top = Math.max(100, document.querySelector('.top')!.getBoundingClientRect().bottom + 24);
    const right = Math.min(side.getBoundingClientRect().left - 28, innerWidth - 24);
    const bottom = Math.min(innerHeight * 0.5, innerHeight - 90);
    const obstacles = [...stage.querySelectorAll('.node, .lk')].map(el => el.getBoundingClientRect());
    const safe = (p: NonNullable<typeof position>) => p.x >= 24 && p.y >= top && p.x + p.w <= right && p.y + p.h <= bottom
      && !obstacles.some(o => overlaps({ left: p.x, top: p.y, right: p.x + p.w, bottom: p.y + p.h }, o));
    if (position && safe(position)) { button.hidden = false; return; }
    // Reuse valid positions; sample only whitespace in the upper half.
    button.hidden = true;
    const candidates: NonNullable<typeof position>[] = [];
    for (const w of [260, 220, 180, 150]) {
      const h = w * image.naturalHeight / image.naturalWidth;
      for (let y = top; y + h <= bottom; y += 20) {
        for (let x = 24; x + w <= right; x += 20) {
          const p = { x, y, w, h };
          if (safe(p)) candidates.push(p);
        }
      }
      if (candidates.length) break;
    }
    if (!candidates.length) return;
    position = candidates[Math.floor(Math.random() * candidates.length)];
    Object.assign(button.style, { left: `${position.x}px`, top: `${position.y}px`, width: `${position.w}px` });
    button.hidden = false;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(place); }
  new MutationObserver(schedule).observe(stage, { childList: true, subtree: true, attributes: true });
  new ResizeObserver(schedule).observe(side);
  window.addEventListener('resize', schedule);
  stage.addEventListener('animationend', schedule);
  image.onload = schedule;
  return {
    set(src?: string, alt = '', thumbnail?: string) {
      image.alt = alt;
      button.setAttribute('aria-label', `View image: ${alt}`);
      if (source === (src || '')) { schedule(); return; }
      source = src || '';
      position = undefined;
      button.hidden = true;
      if (source) image.src = thumbnail || source;
      schedule();
    }
  };
}
