import { byId, ui } from './content';
import { esc, t } from './state';
import { pauseVideo, videoHtml, wireVideo } from './video';

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
 * v71.5: with `demo`, the project's demo video comes first and a switch above leads to the clickable prototype
 * (owner: the map stays put; video and prototype both live in this pop-up, easy to close).
 */
export function openFrame(src: string, label: string, note: string, onClose?: () => void, demo?: { sources: string[]; poster: string; tabs: [string, string] }) {
  if (document.querySelector('.lightbox')) return;
  const previous = document.activeElement as HTMLElement | null;
  const lb = document.createElement('dialog');
  lb.className = `lightbox is-frame${demo ? ' has-demo' : ''}`;
  lb.setAttribute('aria-label', label);
  // the × comes first so it takes the focus on opening; a focused frame would swallow Esc
  const tabs = demo ? `<div class="lb-tabs" role="tablist"><button type="button" role="tab" class="lb-tab" data-pane="demo" aria-selected="true">${esc(demo.tabs[0])}</button><button type="button" role="tab" class="lb-tab" data-pane="proto" aria-selected="false">${esc(demo.tabs[1])}</button></div>` : '';
  lb.innerHTML = `<button class="p-btn lb-close" aria-label="${esc(t(ui.close))}">×</button>
    <figure class="lb-fig">${tabs}${demo ? `<div class="lb-demo">${videoHtml(demo.sources, demo.poster, cssPx('--promo-w'), cssPx('--promo-h'))}</div>` : ''}<iframe class="lb-frame" ${demo ? 'data-src' : 'src'}="${esc(src)}" title="${esc(label)}" scrolling="no"${demo ? ' hidden' : ''}></iframe><figcaption class="lb-note">${esc(note)}</figcaption></figure>`;
  const frame = lb.querySelector<HTMLIFrameElement>('.lb-frame')!, demoBox = lb.querySelector<HTMLElement>('.lb-demo');
  const fit = () => {
    const pad = cssPx('--lb-pad'), room = cssPx('--lb-note-room') * (demo ? 2 : 1); // the switch takes a row too
    const size = (ratio: number, maxW: number) => Math.min(window.innerWidth - 2 * pad, (window.innerHeight - 2 * pad - room) * ratio, window.innerWidth * cssPx('--lb-frame-share') / 100, maxW);
    // never larger than the page's own size or --lb-frame-share % of the screen (owner: too big on large screens)
    const ratio = cssPx('--proto-w') / cssPx('--proto-h'), w = size(ratio, cssPx('--proto-w'));
    Object.assign(frame.style, { width: `${Math.round(w)}px`, height: `${Math.round(w / ratio)}px` });
    if (demoBox) demoBox.style.width = `${Math.round(size(cssPx('--promo-w') / cssPx('--promo-h'), cssPx('--promo-w')))}px`;
  };
  const show = (pane: string) => {
    lb.querySelectorAll<HTMLButtonElement>('.lb-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.pane === pane)));
    if (demoBox) {
      demoBox.hidden = pane !== 'demo';
      if (pane !== 'demo') pauseVideo(demoBox);
    }
    frame.hidden = pane !== 'proto';
    if (pane === 'proto' && !frame.src) frame.src = frame.dataset.src!; // load the prototype only when asked for
  };
  lb.querySelectorAll<HTMLButtonElement>('.lb-tab').forEach((b) => (b.onclick = () => show(b.dataset.pane!)));
  // Esc pressed inside the page arrives as a message (public/demo/dashboard.html)
  const onMessage = (e: MessageEvent) => { if ((e.data as { protoEsc?: boolean } | null)?.protoEsc) close(); };
  const close = () => { if (demoBox) pauseVideo(demoBox); removeEventListener('resize', fit); removeEventListener('message', onMessage); lb.close(); lb.remove(); previous?.focus({ preventScroll: true }); onClose?.(); };
  lb.querySelector<HTMLButtonElement>('.lb-close')!.onclick = close;
  lb.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  lb.onclick = (e) => { if (e.target === lb || e.target === lb.querySelector('.lb-fig')) close(); };
  addEventListener('resize', fit);
  addEventListener('message', onMessage);
  fit();
  document.body.append(lb);
  lb.showModal();
  if (demoBox) wireVideo(demoBox);
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
