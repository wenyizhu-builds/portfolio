import './style.css';
import { ancestors, byId, site, ui } from './content';
import { createMap, type MapApi } from './map';
import { mobileScrollTo, renderMobile } from './mobile';
import { contactPanel, indexBar, indexPanel, nodePanel, resumePanel, wirePanel } from './panel';
import { icon } from './shapes';
import { esc, go, onChange, parseRoute, setLang, state, t, type Route } from './state';

const app = document.getElementById('app')!;
document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';

app.innerHTML = `
  <div class="desk">
    <header class="top">
      <a href="#/" class="brand" aria-label="${esc(site.name)} — ${esc(t(ui.home))}">
        <span class="brand-name">${esc(site.name.toLowerCase())}</span>
      </a>
      <nav class="top-nav">
        <button class="top-link lang-switch" id="lang-switch"></button>
        <a href="#/resume" class="top-link"><span data-i="resume"></span> <i aria-hidden="true">↗</i></a>
        <a href="#/contact" class="top-link"><span data-i="contact"></span> <i aria-hidden="true">↗</i></a>
      </nav>
    </header>
    <main class="stage" id="stage"></main>
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

let map: MapApi | null = null;
let route: Route = parseRoute();

/* ---------- chrome text ---------- */
function paintChrome() {
  document.querySelector('[data-i="resume"]')!.textContent = t(ui.resume);
  document.querySelector('[data-i="contact"]')!.textContent = t(ui.contact);
  const ls = document.getElementById('lang-switch')!;
  ls.textContent = t(ui.langName);
  ls.setAttribute('aria-label', t(ui.langAria));
  const proto = document.getElementById('proto');
  if (proto) proto.textContent = t(ui.prototype);
  const lg = (type: Parameters<typeof icon>[0], k: keyof typeof ui) =>
    `<span>${icon(type, 12)}${esc(t(ui[k]))}</span>`;
  document.getElementById('legend')!.innerHTML =
    `<span><b class="lg-num">${esc(t(ui.legendNumSample))}</b>${esc(t(ui.legendNum))}</span>` + lg('case', 'legendCase') + lg('ai', 'legendAi') + lg('creative', 'legendCreative') + lg('role', 'legendPath') + lg('school', 'education');
}

document.getElementById('lang-switch')!.onclick = () => setLang(state.lang === 'en' ? 'zh' : 'en');

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
  const items = n?.media || [];
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
  fitSide();
  placeAnchor();
}

function placeAnchor() {
  if (!map) return;
  const W = stage.clientWidth;
  if (!W) return; // phone layout: the map is hidden
  const H = stage.clientHeight;
  // The map uses everything left of the panel column. Read where CSS put the column
  // (--side-at / --side-w) instead of repeating those numbers here.
  const side = document.querySelector<HTMLElement>('.side')!.getBoundingClientRect();
  const inset = cssPx('--map-inset'), gap = cssPx('--map-gap');
  const top = cssPx('--top-h');
  const w = side.left - stage.getBoundingClientRect().left - gap - inset;
  map.setViewport({ x: inset, y: top, w: Math.max(cssPx('--map-min-w'), w), h: H - top - cssPx('--bottom-h') });
}

/* ---------- lightbox (the only overlay) ---------- */
function openLightbox(src: string) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<img src="${esc(src)}" alt=""/><button class="p-btn" aria-label="${esc(t(ui.close))}">×</button>`;
  const close = () => {
    lb.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
  lb.onclick = close;
  document.addEventListener('keydown', onKey);
  document.body.append(lb);
}

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
  map = createMap(stage, (id) => {
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
  renderMobile(document.getElementById('mob')!);
  if (!mq.matches) renderPanel(true);
});

paintChrome();
renderMobile(document.getElementById('mob')!);
applyRoute();
