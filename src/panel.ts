import { ancestors, byId, childrenOf, indexSections, kindOf, rolesOrder, schoolsOrder, site, ui, workOf, type SiteNode } from './content';
import { esc, isDone, t } from './state';
import { AST, astSvg, icon, iconFor } from './shapes';
import { L, contactRows, detailLists, highlight, intro, resumeLists, resumePdf, tx, wireCopy } from './blocks';

/* List rows are plain bullets (shapes stay on the category headings, where they match the map). */
/* Section marks sit in the gutter, left of the text column (as in the reference). */
const MARK = { detail: '↳', results: '↗', work: '↘', links: '⇄' };

/** The family a node belongs to ("Growth Marketing", "Experience"), shown in grey under a linked title. */
function familyOf(id: string): string {
  const chain = [id, ...ancestors(id)].filter((a) => a !== 'root' && a !== 'info');
  return t(byId.get(chain[chain.length - 1])!.label);
}

/** A list row: the title, and optionally one grey small-capitals line under it. No bullets. */
function nodeLink(id: string, sub = ''): string {
  const n = byId.get(id);
  if (!n) return '';
  const line = n.status ? t(n.kicker) : sub;
  // an item that can't be opened further (a single piece of work, a role) gets a dash; groups don't
  const leaf = !childrenOf(id).length;
  return `<a class="nlink${leaf ? ' is-leaf' : ''}${isDone(id) ? ' is-visited' : ''}" href="#/${id}"><span class="nlink-t">${tx(n.label)}</span>${line ? `<span class="lab">${esc(line)}</span>` : ''}</a>`;
}

function groupLink(id: string): string {
  const n = byId.get(id);
  return n ? `<a class="ngroup-h${isDone(id) ? ' is-visited' : ''}" href="#/${id}">${tx(n.label)}</a>` : '';
}

function details(mark: string, title: string, body: string, open = false, cls = ''): string {
  return `<details class="sec${cls ? ` ${cls}` : ''}"${open ? ' open' : ''}><summary><span class="p-ico" aria-hidden="true">${mark}</span><span class="lab">${title}</span><i aria-hidden="true"></i></summary><div class="sec-body">${body}</div></details>`;
}

/** Everything inside a node, as links: grouped by practice for an area, in path order for Experience / Education. */
function insideList(n: SiteNode): string {
  const kids = childrenOf(n.id);
  if (n.id === 'experience' || n.id === 'education') {
    const order = n.id === 'experience' ? rolesOrder : schoolsOrder;
    return `<div class="nlist">${order.map((id) => nodeLink(id)).join('')}</div>`;
  }
  if (n.type === 'branch' && kids.some((k) => childrenOf(k.id).length)) {
    const groups = kids
      .map((k) => `<div class="ngroup">${groupLink(k.id)}<div class="nlist">${childrenOf(k.id).map((c) => nodeLink(c.id)).join('')}</div></div>`)
      .join('');
    return `<div class="nlist">${groups}</div>`;
  }
  return kids.length ? `<div class="nlist">${kids.map((k) => nodeLink(k.id)).join('')}</div>` : '';
}

/*
 * The INDEX: what the panel shows on arrival (a résumé beside the map).
 * First my one-line bio and key numbers, then one section per kind of work, each
 * listing everything the map holds. Clicking a point on the map opens that point
 * here; the small INDEX bar above the card brings this view back.
 */
export function indexPanel(): string {
  const stats = `<ul class="ix-stats">${site.note
    .map((x) => `<li><strong>${esc(x.num)}</strong><span>${tx(x.label)}</span></li>`)
    .join('')}</ul>`;
  const bio = details(
    astSvg(AST.index, 'ix-ast'),
    L('index'),
    `<h2 class="sr-only p-title" tabindex="-1">${esc(site.name)}</h2>
     <p class="ix-bio">${highlight(t(site.intro), t(site.introHighlight))}</p>${stats}<a class="ix-more" href="#/info">${L('moreAbout')} →</a>`,
    true,
    'ix',
  );
  const secs = indexSections.map((id) => {
    const n = byId.get(id)!;
    return details(icon(kindOf(id), 11, false, true), isDone(id) ? `<s>${tx(n.label)}</s>` : tx(n.label), `${n.summary ? `<p class="p-sum p-def">${tx(n.summary)}</p>` : ''}${insideList(n)}`, false, 'ix');
  });
  return `<div class="p-body ix-body">${bio}${secs.join('')}</div>`;
}

/** The bar above every other card: back to the INDEX. */
export function indexBar(): string {
  return `<a class="ixbar" href="#/" aria-label="${L('backToIndex')}"><span class="p-ico">${astSvg(AST.index, 'ix-ast')}</span><span class="lab">${L('index')}</span><i aria-hidden="true">←</i></a>`;
}

/* No back button (v44): the map and the INDEX bar are the way around; × returns to the INDEX. */
function head(typeText: string, iconHtml: string): string {
  return `<div class="p-head">
    <span class="p-ico">${iconHtml}</span><span class="lab p-path">${esc(typeText)}</span>
    <div class="p-actions">
      <button class="p-btn" data-act="close" aria-label="${L('close')}">×</button>
    </div>
  </div>`;
}

/*
 * A card says where it sits instead of what type it is: the header is the path
 * (e.g. "GROWTH MARKETING / UGC & INFLUENCER") next to the family's shape.
 * A group card is just its title, a line about it, and its items as bullets.
 */
export function nodePanel(n: SiteNode): string {
  // the header says where the card sits; Information is only a folder, so it is left out
  const path = ancestors(n.id).filter((a) => a !== 'root' && a !== 'info').reverse().map((a) => t(byId.get(a)!.label)).join(' / ');
  // A top-level card (Growth Marketing, Experience…) has no "where": its own name goes in the
  // header next to its shape, and is not repeated below. Otherwise the header is the path and
  // the name is the first line of the card.
  const top = !path;
  const heading = `<h2 class="p-title${top ? ' sr-only' : ''}" tabindex="-1">${tx(n.label)}</h2>`;
  const label = top ? t(n.label) : path;
  const lead = top ? heading + intro(n, '') : intro(n, heading);
  const inside = insideList(n);
  if (inside) {
    // a group: what it is, then its items — no extra section headings
    return head(label, iconFor(n, 11, true)) + `<div class="p-body">${lead}<div class="p-list">${inside}</div></div>`;
  }

  const secs: string[] = detailLists(n).map((d) => details(d.title === L('results') ? MARK.results : MARK.detail, d.title, d.body, true));

  // work done in this role: one flat list, each title with its practice underneath; closed until asked for
  const work = workOf(n.id);
  if (work.length) {
    secs.push(details(MARK.work, `${L('workHere')} · ${work.length}`, `<div class="nlist">${work.map((w) => nodeLink(w.id, t(byId.get(w.parent!)!.label))).join('')}</div>`));
  }

  const conn = new Set<string>();
  (n.related || []).forEach((r) => conn.add(r));
  byId.forEach((o) => o.related?.includes(n.id) && conn.add(o.id)); // reverse relations
  if (conn.size) secs.push(details(MARK.links, L('connections'), `<div class="nlist">${[...conn].map((c) => nodeLink(c, familyOf(c))).join('')}</div>`));

  return head(label, iconFor(n, 11, true)) + `<div class="p-body">${lead}${secs.join('')}</div>`;
}

export function resumePanel(): string {
  return (
    head(t(ui.resume), icon('role', 12)) +
    `<div class="p-body">
      <h2 class="p-title" tabindex="-1">${esc(site.name)}</h2>
      <p class="p-kicker">${tx(site.tag)}</p>
      <div class="cv-actions">${resumePdf()}</div>
      ${resumeLists(true)}
    </div>`
  );
}

export function contactPanel(): string {
  return (
    head(t(ui.contact), icon('info', 12)) +
    `<div class="p-body">
      <h2 class="p-title" tabindex="-1">${L('contact')}</h2>
      ${contactRows()}
      <div class="cv-actions"><a class="btn" href="#/resume">${L('resume')} →</a></div>
    </div>`
  );
}

/** Wire behaviour inside a freshly rendered panel. */
export function wirePanel(root: HTMLElement, onClose: () => void) {
  root.querySelectorAll<HTMLButtonElement>('[data-act="close"]').forEach((b) => (b.onclick = onClose));
  // Only the INDEX is an exclusive accordion; detail sections stay independently open.
  const secs = [...root.querySelectorAll<HTMLDetailsElement>('details.sec.ix')];
  secs.forEach((d) =>
    d.addEventListener('toggle', () => {
      if (d.open) secs.forEach((o) => o !== d && (o.open = false));
    }),
  );
  wireCopy(root);
}
