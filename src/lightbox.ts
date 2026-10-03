import { byId, ui } from './content';
import { esc, t } from './state';

/*
 * The lightbox: the site's only overlay. One picture (a case diagram) or a sequence
 * (a gallery, v63) with ← → buttons, arrow keys and swipe. Shared by desktop and phone.
 */
type Shot = { src: string; caption: string };

const cssPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

function open(seq: Shot[], start: number, label: string) {
  if (document.querySelector('.lightbox') || !seq.length) return;
  const previous = document.activeElement as HTMLElement | null;
  const many = seq.length > 1;
  const lb = document.createElement('dialog');
  lb.className = `lightbox${many ? ' is-sequence' : ''}`;
  lb.setAttribute('aria-label', label || 'Project visual');
  lb.innerHTML = `<figure class="lb-fig"><img alt=""/>${many ? '<figcaption class="lab lb-cap" aria-live="polite"></figcaption>' : ''}</figure>
    <button class="p-btn lb-close" aria-label="${esc(t(ui.close))}">×</button>
    ${many ? `<button class="lb-nav lb-prev" aria-label="${esc(t(ui.prev))}">←</button><button class="lb-nav lb-next" aria-label="${esc(t(ui.next))}">→</button>` : ''}`;
  const img = lb.querySelector('img')!;
  const cap = lb.querySelector<HTMLElement>('.lb-cap');
  let at = start;
  const show = (k: number) => {
    at = (k + seq.length) % seq.length;
    img.src = seq[at].src;
    img.alt = seq[at].caption || label;
    if (cap) cap.textContent = seq[at].caption;
    // fetch the neighbours so the next step is instant
    if (many) [at + 1, at - 1].forEach((j) => { new Image().src = seq[(j + seq.length) % seq.length].src; });
  };
  const close = () => { lb.close(); lb.remove(); previous?.focus({ preventScroll: true }); };
  lb.querySelector<HTMLButtonElement>('.lb-close')!.onclick = close;
  lb.querySelector<HTMLButtonElement>('.lb-prev')?.addEventListener('click', () => show(at - 1));
  lb.querySelector<HTMLButtonElement>('.lb-next')?.addEventListener('click', () => show(at + 1));
  lb.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  lb.addEventListener('keydown', (e) => {
    if (!many) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
  });
  // swipe on touch screens; a swipe is not a click on the backdrop
  let downX: number | null = null, swiped = false;
  lb.addEventListener('pointerdown', (e) => { downX = e.clientX; swiped = false; });
  lb.addEventListener('pointerup', (e) => {
    if (downX === null || !many) return;
    const dx = e.clientX - downX;
    downX = null;
    if (Math.abs(dx) >= cssPx('--swipe')) { swiped = true; show(dx < 0 ? at + 1 : at - 1); }
  });
  lb.addEventListener('pointercancel', () => (downX = null));
  lb.onclick = (e) => { if (!swiped && (e.target === lb || e.target === lb.querySelector('.lb-fig'))) close(); };
  show(start);
  document.body.append(lb);
  lb.showModal();
}

/** One picture, e.g. a case's "How it worked" diagram. */
export function openLightbox(src: string, alt = '') {
  open([{ src, caption: '' }], 0, alt);
}

/** A gallery node's pictures, all its sets in one sequence, starting at set `si`, picture `i`. */
export function openGallery(nodeId: string, si: number, i: number) {
  const n = byId.get(nodeId);
  if (!n?.gallery) return;
  const seq = n.gallery.flatMap((g) => g.items.map((p, k) => ({ src: p.src, caption: `${t(g.title)} · ${k + 1} / ${g.items.length}` })));
  const start = n.gallery.slice(0, si).reduce((sum, g) => sum + g.items.length, 0) + i;
  open(seq, Math.min(start, seq.length - 1), t(n.label));
}
