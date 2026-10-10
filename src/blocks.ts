import { publishedMarkup } from './published-copy';
/*
 * Shared content blocks. The desktop panel (panel.ts) and the phone page (mobile.ts)
 * both build from these, so a node reads the same on every screen and a change here
 * reaches both. Never re-create one of these inline in panel.ts or mobile.ts.
 */
import { byId, childrenOf, filterAll, filterSets, rides, rolesOrder, schoolsOrder, site, ui, workOf, type GallerySet, type RideKey, type SiteNode, type T } from './content';
import { copyFieldKey } from './copy-binding';
import { clearFilters, filters, setFilter, toggleFilter, type FilterKind, esc, missingZh, state, t } from './state';
import { AST, astSvg } from './shapes';

export const L = (k: keyof typeof ui) => esc(t(ui[k]));



/** Localised, escaped text. English shown in Chinese mode is marked lang="en" for screen readers. */
export function tx(v: T | undefined): string {
  if (!v) return '';
  const language = state.lang === 'zh' && v.zh ? 'zh' : 'en';
  const body = publishedMarkup(v, language, esc) ?? esc(t(v));
  const html = missingZh(v) ? `<span lang="en">${body}</span>` : body;
  if (import.meta.env.DEV) {
    const language = state.lang === 'zh' && v.zh ? 'zh' : 'en';
    const key = copyFieldKey(v, language);
    return `<span${key ? ` data-copy-field="${esc(key)}"` : ''}>${html}</span>`;
  }
  return html;
}

/** Emphasis is explicitly authored in content, never inferred from copy. */
export function highlight(text: string, phrase: string): string {
  const at = phrase ? text.indexOf(phrase) : -1;
  return at < 0 ? esc(text) : `${esc(text.slice(0, at))}<mark class="p-highlight">${esc(phrase)}</mark>${esc(text.slice(at + phrase.length))}`;
}

export function zhNote(n: SiteNode): string {
  return missingZh(n.summary || n.label) ? `<p class="zh-note">${L('zhPending')}</p>` : '';
}

/*
 * Card typography (v42, after the reference): one typeface, two sizes — text and
 * small capitals (.lab) — and two colours, ink and grey. Hierarchy comes from grey,
 * capitals and a shared text column (the gutter), never from bigger or bolder type.
 */

/** Where this work was done, as a link: "HoYoverse". */
function orgName(n: SiteNode): string {
  const o = n.org ? byId.get(n.org) : undefined;
  if (!o) return '';
  return `<a class="p-org" href="#/${o.id}">${tx(o.label)}</a>`;
}

const isWork = (n: SiteNode) => n.type === 'case' || n.type === 'ai' || n.type === 'creative';

/** Title, a grey line under it (job title / where + my role), and one small-capitals meta line. */
function identity(n: SiteNode, title: string): string {
  const leaf = !childrenOf(n.id).length;
  const org = n.org ? byId.get(n.org) : undefined;
  const sub = [
    orgName(n),
    n.context ? tx(n.context) : '',
    org?.role ? tx(org.role) : '',
    !isWork(n) && leaf && n.kicker && !n.status ? tx(n.kicker) : '', // a role's job title, a school's degree
  ].filter(Boolean).join(' · ');
  const meta = [
    n.period ? (import.meta.env.DEV && copyFieldKey(n, 'period')
      ? `<span data-copy-field="${esc(copyFieldKey(n, 'period')!)}">${esc(n.period)}</span>`
      : esc(n.period)) : '',
    n.place ? tx(n.place) : '', // v73.7 (owner): a school's city, after its dates
    !isWork(n) && n.markets?.length ? `${L('markets')}: ${n.markets.map(esc).join(', ')}` : '', // v73.4 (owner): on a role card these are target markets, not where she worked — say so
    isWork(n) && n.kicker && !n.tags ? tx(n.kicker) : '', // explicit tags replace the combined platform line
  ].filter(Boolean).join(' · ');
  const tags = isWork(n) ? [...(n.markets || []).map((en) => ({ en })), ...(n.tags || [])] : [];
  if (!title && !sub && !meta) return '';
  return `<div class="p-id${n.type === 'case' || n.type === 'ai' ? ' p-case-id' : ''}">${title}${sub ? `<span class="p-sub">${sub}</span>` : ''}${meta ? `<span class="lab p-meta${n.type === 'case' ? ' p-case-meta' : ''}">${meta}</span>` : ''}${tags.length ? `<div class="p-tags">${tags.map((tag) => `<span class="p-tag">${tx(tag)}</span>`).join('')}</div>` : ''}</div>`;
}

/** The one figure a recruiter should see first, as a sentence: "80M+ views across 9 accounts…". */
function figure(n: SiteNode): string {
  return n.headline ? `<p class="p-fig"><b>${highlight(n.headline.num, n.headline.highlight || '')}</b> <span>${tx(n.headline.label)}</span>${n.headline.note ? `<span class="p-fig-note">${tx(n.headline.note)}</span>` : ''}</p>` : '';
}

export function summary(n: SiteNode): string {
  if (n.status) return `<p class="p-sum muted">${L('prepBody')}</p>`;
  // A group's line only describes what is inside it: grey, like the INDEX (same class, one rule).
  // A single piece of work's summary is the content itself: ink.
  return n.summary ? `<p class="p-sum${childrenOf(n.id).length ? ' p-def' : ''}">${tx(n.summary)}</p>` : '';
}

/** Public pages a reader can open for this piece of work, under its summary. */
function links(n: SiteNode): string {
  if (!n.links?.length || n.status) return '';
  return `<p class="p-links">${n.links.map((l) => `<a class="p-org" href="${esc(l.href)}" target="_blank" rel="noopener">${tx(l.label)} ↗</a>`).join(' · ')}</p>`;
}

/** Everything a reader sees before the details. `title` is the heading element the caller wants. */
export function intro(n: SiteNode, title: string): string {
  return identity(n, title) + (n.results?.length ? '' : figure(n)) + zhNote(n) + summary(n) + links(n);
}

/** The expandable detail lists of a case: its sections, then results. */
export type DetailList = { title: string; body: string; defaultOpen?: boolean; kind?: 'diagram' };
export function detailLists(n: SiteNode): DetailList[] {
  const out: DetailList[] = (n.sections || []).map((s, index) => {
    const paragraph = /^(the\s+)?challenge$/i.test(s.title.en.trim()) && s.items.length === 1;
    const container = paragraph ? 'div' : 'ul';
    const item = paragraph ? 'p' : 'li';
    return {
      title: tx(s.title),
      defaultOpen: !/^(the\s+)?challenge$/i.test(s.title.en.trim()),
      body: `<${container}${paragraph ? ' class="challenge-paragraph"' : ''}${import.meta.env.DEV ? ` data-copy-list="nodes.${n.id}.sections.${index}.items"` : ''}>${s.items.map(i => `<${item}>${tx(i)}</${item}>`).join('')}</${container}>`,
    };
  });
  // Case order (v73.3, owner): Results first, then How it worked (diagram), both open; then the story, folded.
  out.forEach((d, i) => (d.defaultOpen = !!n.sections?.[i]?.open));
  const head: DetailList[] = [];
  if (n.results && (n.results.length || import.meta.env.DEV))
    head.push({ title: L('results'), body: `<ul class="results"${import.meta.env.DEV ? ` data-copy-list="nodes.${n.id}.results"` : ''}>${n.results.map((i) => `<li class="result-row"><span class="result-line${i.metric ? ' has-metric' : ''}">${i.metric || import.meta.env.DEV ? `<span class="result-num"${import.meta.env.DEV && copyFieldKey(i, 'metric') ? ` data-copy-field="${esc(copyFieldKey(i, 'metric')!)}"` : ''}>${publishedMarkup(i, 'metric', esc) ?? highlight(i.metric || '', i.highlight || '')}</span>` : ''}<span class="result-copy">${tx(i)}</span></span></li>`).join('')}</ul>` });
  if (n.diagram) head.push({
    title: tx({ en: 'How it worked', zh: '运作方式' }),
    body: `<button class="p-visual" data-visual-src="${esc(n.diagram.src)}" aria-label="${esc(t(n.diagram.alt))}"><img src="${esc(n.diagram.src)}" alt="${esc(t(n.diagram.alt))}" loading="lazy"/></button>`,
    defaultOpen: true,
    kind: 'diagram',
  });
  if (isWork(n) && n.team && (tx(n.team) || import.meta.env.DEV) && !n.gallery) out.push({ // a gallery has no team line; her own projects have no team field at all
    title: state.lang === 'zh' ? '项目团队' : 'The Team',
    body: `<div class="challenge-paragraph"><p>${tx(n.team)}</p></div>`,
    defaultOpen: false,
  });
  return [...head, ...out];
}

/* ---------- galleries (v63): photo series and design sets ---------- */
/** "36 photos" / "36 张". */
const unitLabel = { photos: ui.unitPhotos, pages: ui.unitPages, posters: ui.unitPosters, screens: ui.unitScreens };
export function setCount(g: GallerySet): string {
  return `${g.items.length} ${esc(t(unitLabel[g.unit]))}`;
}
const setLine = (g: GallerySet) => [g.meta ? tx(g.meta) : '', setCount(g)].filter(Boolean).join(' · ');

/**
 * Desktop gallery layout: the photo book (v63.1, owner's pick from four previews; restored in v63.7 after
 * she tried justified rows in v63.4–63.5 and preferred the original). Rows change size and rhythm like
 * spreads in a photo book. Each row shape gives every picture's width (% of the column), its vertical
 * alignment, and how far the row is indented. Shapes repeat in order; the owner's photo order is kept.
 * A row that would overflow (a landscape picture in a narrow shape) shrinks to fit (L43).
 * The phone uses one sideways row per set instead (v63.3).
 */
type RowShape = { w: number[]; align: ('start' | 'center' | 'end')[]; indent: number };
export const BOOK_ROWS: RowShape[] = [
  { w: [58, 30], align: ['start', 'end'], indent: 0 },
  { w: [28, 28, 28], align: ['start', 'center', 'end'], indent: 0 },
  { w: [44], align: ['start'], indent: 28 },
  { w: [30, 52], align: ['end', 'start'], indent: 6 },
  { w: [36, 24], align: ['start', 'end'], indent: 14 },
];
/** A landscape picture gets at least this share of the row, so it is not shown smaller than the portraits. */
const WIDE_MIN = 58;
/** Long side of the grid previews (the -t.jpg files); the full copies are the size in gallery-images.ts. */
const THUMB_LONG = 900;
/** Roughly how much of the window the desktop gallery column takes (%), so the browser can choose a size. */
const GALLERY_SHARE = 60;

/**
 * The grid of a gallery node, one block per set: a heading, then the pictures.
 * The desktop shows it beside the card (main.ts), the phone inside the card (mobile.ts). Every picture is a button that opens the lightbox at that picture (main.ts listens
 * for data-gal); its small number is the picture's place in the set, which the owner uses to name it.
 */
export function galleryGrid(n: SiteNode, mode: 'desk' | 'phone'): string {
  if (!n.gallery) return '';
  return n.gallery.map((g, si) => {
    // share = the picture's share of the gallery column (%). On the desktop the browser picks the
    // 900px preview, the 1600px copy or the 2400px copy from that (srcset), so big pictures stay sharp on any screen
    // while small ones stay light (v63.10, owner: the biggest photos looked blurry).
    const pic = (k: number, style = '', share = 0) => {
      const p = g.items[k];
      const longSide = Math.max(p.w, p.h), tw = Math.round((p.w * THUMB_LONG) / longSide);
      const big = p.large ? `, ${esc(p.large)} ${p.lw}w` : '';
      const pick = share ? ` srcset="${esc(p.thumb)} ${tw}w, ${esc(p.src)} ${p.w}w${big}" sizes="${Math.round(share * GALLERY_SHARE / 100)}vw"` : '';
      return `<button class="g-item" type="button"${style ? ` style="${style}"` : ''} data-gal="${esc(n.id)}" data-set="${si}" data-i="${k}" aria-label="${esc(t(g.title))} ${k + 1}/${g.items.length}"><img src="${esc(p.thumb)}"${pick} width="${p.w}" height="${p.h}" alt="" loading="lazy" decoding="async"/><span class="g-num" aria-hidden="true">${String(k + 1).padStart(2, '0')}</span></button>`;
    };
    let body: string;
    if (mode === 'phone') {
      body = `<div class="g-strip" tabindex="0" aria-label="${esc(t(g.title))}">${g.items.map((_, k) => pic(k)).join('')}</div>`;
    } else {
      const rows: string[] = [];
      for (let i = 0, r = 0; i < g.items.length; r++) {
        const sh = BOOK_ROWS[r % BOOK_ROWS.length];
        const n = Math.min(sh.w.length, g.items.length - i);
        rows.push(`<div class="g-row" style="padding-left:${sh.indent}%">${Array.from({ length: n }, (_, j) => {
          const p = g.items[i + j];
          const w = p.w > p.h ? Math.max(sh.w[j], WIDE_MIN) : sh.w[j];
          return pic(i + j, `width:${w}%;align-self:${sh.align[j]}`, w);
        }).join('')}</div>`);
        i += n;
      }
      body = `<div class="g-book">${rows.join('')}</div>`;
    }
    return `<section class="g-set" id="g-${esc(g.id)}">
    <h3 class="g-head"><span class="g-title">${tx(g.title)}</span><span class="lab g-meta">${setLine(g)}</span></h3>
    ${body}
  </section>`;
  }).join('');
}

/** The card's list of sets (desktop): each one scrolls the grid beside the card to that set. */
export function gallerySetList(n: SiteNode): string {
  // a prototype node has no list: visitors click through the prototype itself (owner, v64)
  if (n.prototype || !n.gallery) return '';
  return `<div class="p-list"><div class="nlist">${n.gallery.map((g) => `<button class="nlink g-jump" type="button" data-gjump="${esc(g.id)}"><span class="nlink-t">${tx(g.title)}</span><span class="lab">${setLine(g)}</span></button>`).join('')}</div></div>`;
}

/* ---------- résumé ---------- */
export function resumePdf(): string {
  return site.resumePdf
    ? `<a class="btn btn-primary" href="${esc(site.resumePdf)}" download>${L('downloadPdf')} ↓</a>`
    : `<span class="btn btn-disabled" aria-disabled="true">${L('downloadPdf')} · ${L('pdfPending')}</span>`;
}

export function resumeLists(withMapLinks: boolean): string {
  const roles = rolesOrder
    .map((id) => byId.get(id)!)
    .map((r) => {
      const n = workOf(r.id).length;
      const link = withMapLinks
        ? `<a class="cv-map" href="#/${r.id}">${n ? `${L('viewWork')} (${n})` : L('viewOnMap')} →</a>`
        : '';
      return `<li class="cv-item"><div class="cv-when">${esc(r.period || '')}</div>
        <div class="cv-what"><strong>${tx(r.label)}</strong><span>${tx(r.kicker)}</span><p>${tx(r.summary)}</p>${link}</div></li>`;
    })
    .join('');
  const schools = schoolsOrder
    .map((id) => byId.get(id)!)
    .map(
      (s) => `<li class="cv-item"><div class="cv-when">${esc(s.period || '')}</div>
        <div class="cv-what"><strong>${tx(s.label)}</strong><span>${tx(s.kicker)}</span></div></li>`,
    )
    .join('');
  return `<h3 class="cv-h">${L('experience')}</h3><ol class="cv">${roles}</ol>
    <h3 class="cv-h">${L('education')}</h3><ol class="cv">${schools}</ol>`;
}

/* ---------- contact ---------- */
const linkedinHandle = () => site.linkedin.replace(/\/+$/, '').split('/').pop() || site.linkedin;

// v73.11 (owner): each row is built like a case card's section — dashed rule, ↳, label — with the value underneath
const ctRow = (k: string, value: string, action = '') =>
  `<div class="sec ct-row"><div class="ct-h"><span class="p-ico" aria-hidden="true">↳</span><span class="lab">${k}</span>${action}</div><div class="sec-body">${value}</div></div>`;
// v73.13 (owner, option A): a copy icon in the right-hand column, where × and + sit; a tick once copied
const ICON_COPY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M7 5.5h5A1.5 1.5 0 0 1 13.5 7v5a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 12V7A1.5 1.5 0 0 1 7 5.5z"/><path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5"/></svg>';
const ICON_TICK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';
const ctCopy = (text: string, label: string) => `<button class="ct-act" data-copy="${esc(text)}" aria-label="${label}" title="${label}">${ICON_COPY}</button>`;

export function contactRows(): string {
  const email = site.email
    ? ctRow(L('email'), `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`, ctCopy(site.email, L('copy')))
    : ctRow(L('email'), `<span class="muted">${L('emailPending')}</span>`);
  const linkedin = ctRow(L('linkedin'), `<a href="${esc(site.linkedin)}" target="_blank" rel="noopener">${esc(linkedinHandle())} ↗</a>`);
  // v73.9 (owner): a plain-text version for a recruiter's AI assistant
  const ai = ctRow(L('forAi'), `<a href="wenyi.md" target="_blank" rel="noopener">wenyi.md ↗</a>`, ctCopy(new URL('wenyi.md', location.href).href, L('copyLink')));
  return `${email}${linkedin}${ai}`;
}

/** Copy-to-clipboard buttons inside any freshly rendered block. */
export function wireCopy(root: ParentNode) {
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => {
    b.onclick = async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy || '');
        if (b.classList.contains('ct-act')) {
          const label = b.getAttribute('aria-label') || '';
          b.innerHTML = ICON_TICK; b.classList.add('is-done'); b.setAttribute('aria-label', t(ui.copied));
          setTimeout(() => { b.innerHTML = ICON_COPY; b.classList.remove('is-done'); b.setAttribute('aria-label', label); }, 1400);
        } else b.textContent = t(ui.copied);
      } catch {
        /* clipboard unavailable: the address is still visible and selectable */
      }
    };
  });
}

/* ---------- Curate your ride (v71): desktop button + panel in the header; phone drop-downs below ---------- */
/** The chosen options in words, for the button and the ride bar ("Must-stops · Japan"). */
export function rideSummary(): string {
  return (Object.keys(filters) as FilterKind[])
    .filter((k) => filters[k])
    .map((k) => t((filterSets[k].options as Record<string, T>)[filters[k]!]))
    .join(' · ');
}
/** Desktop: a white button (✳ Curate your ride · choices ⌄) that opens into a panel of rides, markets and platforms.
    Built once; `syncRide` keeps it in step, so its open / grow animations aren't cut by a rebuild. */
export function ridePanel(): string {
  const group = (kind: FilterKind, big = false) => {
    const set = filterSets[kind];
    const opts = Object.entries(set.options as Record<string, T>)
      .map(([k, v]) => `<button type="button" class="rchip${big ? ' big' : ''}" data-filter="${kind}:${k}" aria-pressed="false"><span>${esc(t(v))}</span>${big ? `<span>${esc(rideCount(k))}</span>` : ''}</button>`)
      .join('');
    return `<div class="rgroup" role="group" aria-label="${esc(t(set.label))}"><span class="fk">${esc(t(set.label))}</span>${opts}</div>`;
  };
  const chev = '<svg class="rchev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.8L5 6.6 8 3.8"/></svg>';
  return `<div class="ride">
    <button type="button" class="rbtn" data-ride-toggle aria-expanded="false" aria-controls="rpanel">${astSvg(AST.index, 'rb-ast')}<span>${L('curateRide')}</span><span class="rsum"></span>${chev}</button>
    <div class="rpanel" id="rpanel">${group('ride', true)}${group('region')}${group('platform')}
      <div class="rfoot"><button type="button" class="rclear" data-ride-clear>${L('rideClear')}</button><button type="button" class="rgo" data-ride-close>${L('rideShow')}</button></div>
    </div></div>`;
}
function rideCount(k: string): string {
  const n = rides[k as RideKey].stops.length;
  return n === 1 ? t(ui.rideStop1) : t(ui.rideStops).replace('{n}', String(n));
}
/** Pressed states and the summary inside the button. */
export function syncRide(root: ParentNode) {
  root.querySelectorAll<HTMLButtonElement>('.rchip').forEach((b) => {
    const [kind, key] = b.dataset.filter!.split(':');
    b.setAttribute('aria-pressed', String(filters[kind as FilterKind] === key));
  });
  const sum = root.querySelector('.rsum');
  if (sum) sum.textContent = rideSummary();
}
/** Opening, closing and clearing; picking an option goes through wireFilters like everywhere else. */
export function wireRide(root: ParentNode) {
  const panel = root.querySelector<HTMLElement>('.rpanel'), btn = root.querySelector<HTMLButtonElement>('[data-ride-toggle]');
  if (!panel || !btn) return;
  const setOpen = (on: boolean) => { panel.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); };
  btn.onclick = () => setOpen(!panel.classList.contains('open'));
  // v73.6 (owner): "Start my ride" starts the ride itself, so the reader doesn't press a second start button on the ride bar
  root.querySelector<HTMLButtonElement>('[data-ride-close]')!.onclick = () => {
    setOpen(false);
    document.dispatchEvent(new CustomEvent('ride-start')); // metro.ts shows the ride bar and goes to the first stop
  };
  root.querySelector<HTMLButtonElement>('[data-ride-clear]')!.onclick = () => { clearFilters(); setOpen(false); };
  const goBtn = root.querySelector<HTMLButtonElement>('[data-ride-close]')!;
  document.addEventListener('ride-count', (e) => { goBtn.textContent = L((e as CustomEvent<number>).detail === 1 ? 'rideOpen' : 'rideShow'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}
/** Phone: two plain drop-downs (target market, platform) — no rides, since there is no map to ride (v72.3). */
export function filterSelects(): string {
  const sel = (kind: FilterKind) => {
    const set = filterSets[kind];
    const opts = Object.entries(set.options as Record<string, T>)
      .map(([k, v]) => `<option value="${k}"${filters[kind] === k ? ' selected' : ''}>${esc(t(v))}</option>`)
      .join('');
    return `<label class="m-fsel"><span class="fk">${esc(t(set.label))}</span><select data-fsel="${kind}"><option value="">${esc(t(filterAll))}</option>${opts}</select></label>`;
  };
  return `<div class="m-filters">${sel('region')}${sel('platform')}</div>`;
}
/** Both forms of the filters; `after` runs once a choice has been applied. */
export function wireFilters(root: ParentNode, after?: () => void) {
  root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => {
    b.onclick = () => {
      const [kind, key] = b.dataset.filter!.split(':');
      toggleFilter(kind as FilterKind, key);
      after?.();
    };
  });
  root.querySelectorAll<HTMLSelectElement>('[data-fsel]').forEach((s) => {
    s.onchange = () => {
      setFilter(s.dataset.fsel as FilterKind, s.value || null);
      // a ride and the other two exclude each other: show what the pick switched off
      root.querySelectorAll<HTMLSelectElement>('[data-fsel]').forEach((o) => (o.value = filters[o.dataset.fsel as FilterKind] ?? ''));
      after?.();
    };
  });
}
