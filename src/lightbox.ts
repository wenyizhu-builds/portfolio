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

/**
 * A clickable page (the dashboard prototype, v64.6) in the same overlay as the pictures: the same dark
 * background, the same × and Esc, a note underneath. Sized to the page's own window ratio (--proto-w / --proto-h).
 */
export function openFrame(src: string, label: string, note: string, onClose?: () => void) {
  if (document.querySelector('.lightbox')) return;
  const previous = document.activeElement as HTMLElement | null;
  const lb = document.createElement('dialog');
  lb.className = 'lightbox is-frame';
  lb.setAttribute('aria-label', label);
  // the × comes first so it takes the focus on opening; a focused frame would swallow Esc
  lb.innerHTML = `<button class="p-btn lb-close" aria-label="${esc(t(ui.close))}">×</button>
    <figure class="lb-fig"><iframe class="lb-frame" src="${esc(src)}" title="${esc(label)}" scrolling="no"></iframe><figcaption class="lb-note">${esc(note)}</figcaption></figure>`;
  const frame = lb.querySelector<HTMLElement>('.lb-frame')!;
  const fit = () => {
    const ratio = cssPx('--proto-w') / cssPx('--proto-h'), pad = cssPx('--lb-pad');
    // never larger than the page's own size or --lb-frame-share % of the screen (owner: too big on large screens)
    const w = Math.min(window.innerWidth - 2 * pad, (window.innerHeight - 2 * pad - cssPx('--lb-note-room')) * ratio,
      window.innerWidth * cssPx('--lb-frame-share') / 100, cssPx('--proto-w'));
    Object.assign(frame.style, { width: `${Math.round(w)}px`, height: `${Math.round(w / ratio)}px` });
  };
  // Esc pressed inside the page arrives as a message (public/demo/dashboard.html)
  const onMessage = (e: MessageEvent) => { if ((e.data as { protoEsc?: boolean } | null)?.protoEsc) close(); };
  const close = () => { removeEventListener('resize', fit); removeEventListener('message', onMessage); lb.close(); lb.remove(); previous?.focus({ preventScroll: true }); onClose?.(); };
  lb.querySelector<HTMLButtonElement>('.lb-close')!.onclick = close;
  lb.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  lb.onclick = (e) => { if (e.target === lb || e.target === lb.querySelector('.lb-fig')) close(); };
  addEventListener('resize', fit);
  addEventListener('message', onMessage);
  fit();
  document.body.append(lb);
  lb.showModal();
  lb.querySelector<HTMLButtonElement>('.lb-close')!.focus();
}

/** One picture, e.g. a case's "How it worked" diagram. */
export function openLightbox(src: string, alt = '') {
  open([{ src, caption: '' }], 0, alt);
}

/** A gallery node's pictures, all its sets in one sequence, starting at set `si`, picture `i`. */
export function openGallery(nodeId: string, si: number, i: number) {
  const n = byId.get(nodeId);
  if (!n?.gallery) return;
  const seq = n.gallery.flatMap((g) => g.items.map((p, k) => ({ src: p.large || p.src, caption: `${t(g.title)} · ${k + 1} / ${g.items.length}` })));
  const start = n.gallery.slice(0, si).reduce((sum, g) => sum + g.items.length, 0) + i;
  open(seq, Math.min(start, seq.length - 1), t(n.label));
}
