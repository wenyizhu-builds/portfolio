import { applyPublishedCopy } from './published-copy';
import './style.css';
import { createFloatingVisual } from './floating-visual';
import { ancestors, byId, site, ui, type SiteNode } from './content';
import { type MapApi } from './map';
import { createMetro, stationMark } from './metro';
import { mobileScrollTo, renderMobile } from './mobile';
import { contactPanel, indexBar, indexPanel, nodePanel, resumePanel, wirePanel } from './panel';
import { L, galleryGrid, ridePanel, syncRide, wireFilters, wireRide } from './blocks';
import { openFrame, openGallery, openLightbox } from './lightbox';
import { pauseVideo, wireVideo } from './video';
import { esc, filtering, go, onChange, parseRoute, reducedMotion, state, t, type Route } from './state';

if (import.meta.env.PROD) applyPublishedCopy();

// The editor and local drafts are excluded from production builds.
if (import.meta.env.DEV) await (await import('./copy-editor')).initCopyEditor();

const app = document.getElementById('app')!;
document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';

app.innerHTML = `
  <div class="desk">
    <header class="top">
      <div id="filters"></div>
      <nav class="top-nav">
        <a href="#/resume" class="top-link"><span data-i="resume"></span> <i aria-hidden="true">↗</i></a>
        <a href="#/contact" class="top-link"><span data-i="contact"></span> <i aria-hidden="true">↗</i></a>
      </nav>
    </header>
    <main class="stage" id="stage"></main>
    <section class="gallery" id="gallery"></section>
    <div class="side">
      <nav class="ixnav" id="ixnav"></nav>
      <aside class="media" id="media"></aside>
      <aside class="panel" id="panel"><div class="panel-inner" id="panel-inner"></div></aside>
    </div>
    <div class="legend" id="legend"></div>
    ${site.launched ? '' : '<p class="proto" id="proto"></p>'}
    <p class="sr-only" id="announce" aria-live="polite"></p>
  </div>
  <div class="mob" id="mob"></div>
`;

const stage = document.getElementById('stage')!;
const panel = document.getElementById('panel')!;
const media = document.getElementById('media')!;
const ixnav = document.getElementById('ixnav')!;
const inner = document.getElementById('panel-inner')!;
/* v63: a gallery node (Photography, Design) shows its pictures in the map's place, left of the card. */
const gallery = document.getElementById('gallery')!;
let galleryOf = '';
/* The card's height follows its content with a CSS transition (see .panel). A
   ResizeObserver catches every change: a new card, an opened section, a language switch. */
new ResizeObserver(() => {
  fitSide();
  placeAnchor();
}).observe(inner);

/* The column (INDEX bar, image strip, card) is centred, so any box that pops in or out
   makes the whole column jump. Every box therefore gets an explicit height that CSS eases
   (the reference does this for its card), and the card's height is capped at the room left,
   so the animation never runs into a ceiling and stops dead. */
function fitSide() {
  const sideEl = document.querySelector<HTMLElement>('.side');
  if (!sideEl || mq.matches) return;
  const gap = cssPx('--side-gap');
  const bar = ixnav.firstElementChild as HTMLElement | null;
  const ixH = bar ? bar.offsetHeight + gap : 0;
  const mdH = media.classList.contains('open') ? cssPx('--media-h') + gap : 0;
  ixnav.style.height = `${ixH}px`;
  media.style.height = `${mdH}px`;
  const panelStyle = getComputedStyle(panel);
  const border = parseFloat(panelStyle.borderTopWidth) + parseFloat(panelStyle.borderBottomWidth);
  panel.style.height = `${Math.max(0, Math.min(inner.offsetHeight + border, sideEl.clientHeight - ixH - mdH))}px`;
}
/* The scrollbar only shows while the card is being scrolled (like an overlay scrollbar). */
let scrollIdle = 0;
panel.addEventListener('scroll', () => {
  panel.classList.add('scrolling');
  clearTimeout(scrollIdle);
  scrollIdle = window.setTimeout(() => panel.classList.remove('scrolling'), cssMs('--scrollbar-linger'));
}, { passive: true });
/** Layout sizes and breakpoints live in CSS (:root) — read them here instead of repeating numbers. */
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const cssPx = (name: string) => parseFloat(cssVar(name)) || 0;
const cssMs = (name: string) => parseFloat(cssVar(name)) || 0;
const mq = window.matchMedia(cssVar('--mq-phone'));

const floatingVisual = createFloatingVisual(stage, document.querySelector<HTMLElement>('.side')!, openLightbox);
let map: MapApi | null = null;
let route: Route = parseRoute();

/* ---------- chrome text ---------- */
function paintChrome() {
  document.querySelector('[data-i="resume"]')!.textContent = t(ui.resume);
  document.querySelector('[data-i="contact"]')!.textContent = t(ui.contact);
  // Curate your ride (v71): built once, then kept in step so its open and grow animations run
  const fb = document.getElementById('filters')!;
  if (!fb.querySelector('.ride')) {
    fb.innerHTML = ridePanel();
    wireRide(fb);
    wireFilters(fb, () => { if (filtering() && route.kind !== 'home') go(''); }); // a new ride starts from the map
  }
  syncRide(fb);
  const proto = document.getElementById('proto');
  if (proto) proto.textContent = t(ui.prototype);
  // metro map legend (v71): one meaning per mark — key case, interchange, other stop — and the hollow Campus line
  document.getElementById('legend')!.innerHTML =
    `<span>${stationMark('key')}${esc(t(ui.legendKeyCase))}</span><span>${stationMark('interchange')}${esc(t(ui.legendInterchange))}</span><span>${stationMark('dot')}${esc(t(ui.legendOtherStop))}</span><span><i class="lg-campus" aria-hidden="true"></i>${esc(t(ui.education))}</span>`;
}


/* ---------- desktop panel + media ---------- */

function currentNodeId(): string | null {
  return route.kind === 'node' && byId.has(route.id) ? route.id : null;
}

/** Re-render the panel. `keep` = same page in another language: keep scroll and open sections. */
function renderPanel(keep = false) {
  const prevScroll = panel.scrollTop;
  const prevOpen = [...inner.querySelectorAll('details.sec')].map((d) => (d as HTMLDetailsElement).open);
  // The panel is always there: the INDEX at home, otherwise the chosen card under an INDEX bar.
  const id0 = currentNodeId();
  const html =
    route.kind === 'resume' ? resumePanel()
    : route.kind === 'contact' ? contactPanel()
    : id0 ? nodePanel(byId.get(id0)!)
    : indexPanel();
  inner.innerHTML = html;
  panel.classList.add('open');
  ixnav.innerHTML = route.kind === 'home' ? '' : indexBar();
  if (keep) {
    inner.querySelectorAll<HTMLDetailsElement>('details.sec').forEach((d, i) => (d.open = prevOpen[i] ?? d.open));
    panel.scrollTop = prevScroll;
  } else panel.scrollTop = 0;
  if (html) {
    wirePanel(panel, () => go(''));
  }

  // media tiles beside the panel
  const id = currentNodeId();
  const n = id ? byId.get(id) : undefined;
  const visual = n?.media?.find(m => m.floating && m.src);
  floatingVisual.set(visual?.src, visual ? t(visual.alt) : '', visual?.thumbnail, id ?? '');
  // v71.5: an AI project keeps the map; its "Try the prototype" bar floats beside its station
  floatingVisual.setApp(n?.prototype ? appBar(n) : '', id ?? '');
  const items = (n?.media || []).filter(m => !m.floating);
  media.innerHTML = `<div class="media-row">${items
    .map((m) =>
      m.src
        ? `<button class="tile" data-src="${esc(m.src)}"><img src="${esc(m.src)}" alt="${esc(t(m.alt))}" loading="lazy"/>${
            m.caption ? `<span>${esc(t(m.caption))}</span>` : ''
          }</button>`
        : `<div class="tile tile-empty"><span class="tile-k">${esc(t(m.alt))}</span><span>${esc(t(ui.visualsPrep))}</span></div>`,
    )
    .join('')}</div>`;
  media.classList.toggle('open', items.length > 0 && !!html);
  document.querySelector('.desk')!.classList.toggle('has-media', items.length > 0 && !!html);
  media.querySelectorAll<HTMLButtonElement>('.tile[data-src]').forEach((b) => (b.onclick = () => openLightbox(b.dataset.src!)));

  // the gallery takes the map's place; the same node in another language keeps its scroll
  const showGallery = !!n?.gallery && !n.prototype; // a prototype's screens are for the phone; the desktop keeps the map (v71.5)
  if (showGallery) {
    const prevGalleryScroll = gallery.scrollTop;
    gallery.innerHTML = galleryHtml(n!);
    wireVideo(gallery);
    gallery.scrollTop = keep && galleryOf === n!.id ? prevGalleryScroll : 0;
    gallery.setAttribute('aria-label', t(n!.label));
  }
  if (!showGallery) pauseVideo(gallery); // a hidden gallery never keeps playing
  galleryOf = showGallery ? n!.id : '';
  document.querySelector('.desk')!.classList.toggle('has-gallery', showGallery);
  gallery.inert = !showGallery;
  fitSide();
  placeAnchor();
}

const galleryHtml = (n: SiteNode) => `<button class="g-back" type="button" data-act="gback" aria-label="${L('backToMap')}"><span aria-hidden="true">←</span><span class="lab">${L('mapWord')}</span></button>${galleryGrid(n, 'desk')}`;
/* v64.4 → v71.5 (owner): an AI project no longer replaces the map with its video. A small app bar floats beside its
   station; it opens one pop-up with the demo video first and the clickable prototype a click away. */
const APP_MARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>';
const appBar = (n: SiteNode) => `<button class="app-bar" type="button" data-act="openapp" aria-label="${esc(L('openApp'))}"><span class="app-tile">${APP_MARK}</span><span class="app-bar-t"><span>${esc(t(n.label))}</span><span class="app-bar-sub">${L('appBarSub')}</span></span><span class="btn">${L('tryApp')}</span></button>`;

/* the app icon opens the prototype in the site's one overlay (lightbox.ts), like the photos */
function openApp() {
  const n = byId.get(currentNodeId() || '');
  if (!n?.prototype) return;
  const P = n.prototype;
  openFrame(P.src, t(n.label), t(ui.protoNote), undefined, P.video.length ? { sources: P.video, poster: P.poster, tabs: [t(ui.demoVideo), t(ui.tryApp)] } : undefined);
}

function placeAnchor() {
  if (!map) return;
  const W = stage.clientWidth;
  if (!W) return; // phone layout: the map is hidden
  const H = stage.clientHeight;
  // The map uses everything left of the panel column. Read where CSS put the column
  // (--side-at / --side-w) instead of repeating those numbers here.
  // offsetLeft, not getBoundingClientRect: the card column slides in on entry (sideIn), and a
  // measurement taken mid-slide left the gallery ~150px short of the card (v63).
  const side = document.querySelector<HTMLElement>('.side')!;
  const inset = cssPx('--map-inset'), gap = cssPx('--map-gap');
  const top = cssPx('--top-h');
  const w = side.offsetLeft - stage.offsetLeft - gap - inset;
  map.setViewport({ x: inset, y: top, w: Math.max(cssPx('--map-min-w'), w), h: H - top - cssPx('--bottom-h') });
  // the gallery covers exactly the map's area and scrolls to the bottom of the window
  Object.assign(gallery.style, { left: `${inset}px`, top: `${top}px`, width: `${Math.max(cssPx('--map-min-w'), w)}px` });
}

/* ---------- lightbox (lightbox.ts) and gallery clicks: one listener for desktop and phone ---------- */
document.addEventListener('click', e => {
  const el = e.target as Element;
  // a click on empty space around the map goes back to the default map, like a click on the map's own background (v71.6)
  if ((el === stage || el.classList.contains('desk')) && route.kind !== 'home' && !mq.matches) { go(''); return; }
  const tile = el.closest<HTMLButtonElement>('[data-visual-src]');
  if (tile) openLightbox(tile.dataset.visualSrc!, tile.querySelector('img')?.alt);
  const pic = el.closest<HTMLButtonElement>('[data-gal]');
  if (pic) openGallery(pic.dataset.gal!, Number(pic.dataset.set), Number(pic.dataset.i));
  const jump = el.closest<HTMLButtonElement>('[data-gjump]');
  if (jump) {
    const target = gallery.querySelector<HTMLElement>(`#g-${CSS.escape(jump.dataset.gjump!)}`);
    if (target) gallery.scrollTo({ top: target.offsetTop, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
  if (el.closest('[data-act="openapp"]')) openApp();
  if (el.closest('[data-act="gback"]')) {
    const p = byId.get(currentNodeId() || '')?.parent;
    go(p && p !== 'root' ? p : '');
  }
});

/* ---------- routing ---------- */
/* Keyboard users land on the panel title after choosing a node; mouse users keep their place. */
let viaKeyboard = false;
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') viaKeyboard = true; }, true);
document.addEventListener('pointerdown', () => (viaKeyboard = false), true);
const announce = document.getElementById('announce')!;

function applyRoute() {
  route = parseRoute();
  // unknown or malformed links fall back to the home map instead of a half-state
  if (route.kind === 'node' && !byId.has(route.id)) {
    history.replaceState(null, '', '#/');
    route = { kind: 'home' };
  }
  if (mq.matches) {
    const id = route.kind === 'node' ? route.id : route.kind === 'home' ? null : route.kind;
    mobileScrollTo(id ? resolveMobileTarget(id) : null);
    return;
  }
  ensureMap();
  const id = currentNodeId();
  map!.setFocus(id);
  renderPanel();
  const title = panel.querySelector<HTMLElement>('.p-title');
  announce.textContent = title?.textContent || '';
  if (title && viaKeyboard) title.focus();
}

function resolveMobileTarget(id: string): string {
  if (document.getElementById(`m-${id}`)) return id;
  const node = byId.get(id);
  if (node && (node.type === 'role' || node.type === 'school' || id === 'experience' || id === 'education')) return 'resume';
  for (const a of ancestors(id)) if (document.getElementById(`m-${a}`)) return a;
  return 'info';
}

function ensureMap() {
  if (map) return;
  map = createMetro(stage, (id) => {
    const cur = currentNodeId();
    if (id === 'root') {
      go('');
    } else if (id === cur) {
      const p = byId.get(id)?.parent;
      go(p && p !== 'root' ? p : ''); // clicking the current node steps back, like the reference's ×
    } else go(id);
  });
  placeAnchor();
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || mq.matches || document.querySelector('.lightbox')) return;
  if (route.kind !== 'home') go(''); // like ×: back to the INDEX
});

window.addEventListener('hashchange', applyRoute);
window.addEventListener('resize', () => { fitSide(); placeAnchor(); });
mq.addEventListener('change', () => {
  renderMobile(document.getElementById('mob')!);
  applyRoute();
});

onChange(() => {
  paintChrome();
  map?.rerenderLabels();
  map?.refilter();
  renderMobile(document.getElementById('mob')!);
  if (!mq.matches) renderPanel(true);
});

paintChrome();
renderMobile(document.getElementById('mob')!);
applyRoute();

if (import.meta.env.DEV) window.addEventListener('copy-preview', () => {
  paintChrome(); map?.rerenderLabels();
  renderMobile(document.getElementById('mob')!);
  if (!mq.matches) renderPanel(true);
});
