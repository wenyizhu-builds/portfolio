import { publishedMarkup } from './published-copy';
/*
 * Shared content blocks. The desktop panel (panel.ts) and the phone page (mobile.ts)
 * both build from these, so a node reads the same on every screen and a change here
 * reaches both. Never re-create one of these inline in panel.ts or mobile.ts.
 */
import { byId, childrenOf, rolesOrder, schoolsOrder, site, ui, workOf, type SiteNode, type T } from './content';
import { copyFieldKey } from './copy-binding';
import { diagramSvg, hasDiagram } from './diagrams';
import { esc, missingZh, state, t } from './state';

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
    ...(!isWork(n) ? (n.markets || []).map(esc) : []),
    isWork(n) && n.kicker && !n.tags ? tx(n.kicker) : '', // explicit tags replace the combined platform line
  ].filter(Boolean).join(' · ');
  const tags = isWork(n) ? [...(n.markets || []).map((en) => ({ en })), ...(n.tags || [])] : [];
  if (!title && !sub && !meta) return '';
  return `<div class="p-id${n.type === 'case' ? ' p-case-id' : ''}">${title}${sub ? `<span class="p-sub">${sub}</span>` : ''}${meta ? `<span class="lab p-meta${n.type === 'case' ? ' p-case-meta' : ''}">${meta}</span>` : ''}${tags.length ? `<div class="p-tags">${tags.map((tag) => `<span class="p-tag">${tx(tag)}</span>`).join('')}</div>` : ''}</div>`;
}

/** The one figure a recruiter should see first, as a sentence: "80M+ views across 9 accounts…". */
function figure(n: SiteNode): string {
  return n.headline ? `<p class="p-fig"><b>${highlight(n.headline.num, n.headline.highlight || '')}</b> <span>${tx(n.headline.label)}</span></p>` : '';
}

export function summary(n: SiteNode): string {
  if (n.status) return `<p class="p-sum muted">${L('prepBody')}</p>`;
  // A group's line only describes what is inside it: grey, like the INDEX (same class, one rule).
  // A single piece of work's summary is the content itself: ink.
  return n.summary ? `<p class="p-sum${childrenOf(n.id).length ? ' p-def' : ''}">${tx(n.summary)}</p>` : '';
}

/** Everything a reader sees before the details. `title` is the heading element the caller wants. */
export function intro(n: SiteNode, title: string): string {
  return identity(n, title) + (n.results?.length ? '' : figure(n)) + zhNote(n) + summary(n);
}

/** The expandable detail lists of a case: its sections, then results. */
export function detailLists(n: SiteNode): { title: string; body: string; defaultOpen?: boolean }[] {
  const out: { title: string; body: string; defaultOpen?: boolean }[] = (n.sections || []).map((s, index) => {
    const paragraph = /^(the\s+)?challenge$/i.test(s.title.en.trim()) && s.items.length === 1;
    const container = paragraph ? 'div' : 'ul';
    const item = paragraph ? 'p' : 'li';
    return {
      title: tx(s.title),
      defaultOpen: !/^(the\s+)?challenge$/i.test(s.title.en.trim()),
      body: `<${container}${paragraph ? ' class="challenge-paragraph"' : ''}${import.meta.env.DEV ? ` data-copy-list="nodes.${n.id}.sections.${index}.items"` : ''}>${s.items.map(i => `<${item}>${tx(i)}</${item}>`).join('')}</${container}>`,
    };
  });
  // Case order (flagship review): the system diagram and Results first, open; then the story, folded.
  out.forEach((d) => (d.defaultOpen = false));
  const head: { title: string; body: string; defaultOpen?: boolean }[] = [];
  if (hasDiagram(n.diagram)) head.push({ title: tx({ en: 'How it worked', zh: '运作方式' }), body: diagramSvg(n.diagram!, tx), defaultOpen: true });
  if (n.results && (n.results.length || import.meta.env.DEV))
    head.push({ title: L('results'), body: `<ul class="results"${import.meta.env.DEV ? ` data-copy-list="nodes.${n.id}.results"` : ''}>${n.results.map((i) => `<li class="result-row"><span class="result-line${i.metric ? ' has-metric' : ''}">${i.metric || import.meta.env.DEV ? `<span class="result-num"${import.meta.env.DEV && copyFieldKey(i, 'metric') ? ` data-copy-field="${esc(copyFieldKey(i, 'metric')!)}"` : ''}>${publishedMarkup(i, 'metric', esc) ?? highlight(i.metric || '', i.highlight || '')}</span>` : ''}<span class="result-copy">${tx(i)}</span></span></li>`).join('')}</ul>` });
  if (isWork(n) && n.team) out.push({
    title: state.lang === 'zh' ? '项目团队' : 'The Team',
    body: `<div class="challenge-paragraph"><p>${tx(n.team)}</p></div>`,
    defaultOpen: false,
  });
  return [...head, ...out];
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

export function contactRows(): string {
  const email = site.email
    ? `<div class="ct-row"><span class="ct-k">${L('email')}</span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><button class="p-btn ct-copy" data-copy="${esc(site.email)}">${L('copy')}</button></div>`
    : `<div class="ct-row"><span class="ct-k">${L('email')}</span><span class="muted">${L('emailPending')}</span></div>`;
  return `${email}<div class="ct-row"><span class="ct-k">${L('linkedin')}</span><a href="${esc(site.linkedin)}" target="_blank" rel="noopener">${esc(linkedinHandle())} ↗</a></div>`;
}

/** Copy-to-clipboard buttons inside any freshly rendered block. */
export function wireCopy(root: ParentNode) {
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => {
    b.onclick = async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy || '');
        b.textContent = t(ui.copied);
      } catch {
        /* clipboard unavailable: the address is still visible and selectable */
      }
    };
  });
}
