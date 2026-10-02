import { byId, childrenOf, featuredOrder, kindLabel, kindOf, site, type SiteNode } from './content';
import { esc, filtering, matches, reducedMotion, setLang, state, t } from './state';
import { AST, astSvg, icon, iconFor } from './shapes';
import { L, contactRows, detailLists, filterSelects, intro, resumeLists, resumePdf, summary, tx, wireCopy, wireFilters } from './blocks';

/*
 * Phone layout: one scrolling page. The map becomes a menu (owner decision
 * 2026-09-27). Each area is a section; cases are compact cards with a
 * "More" toggle for details. All card content comes from blocks.ts — the same
 * source as the desktop panel.
 */

const scrollBehavior = (): ScrollBehavior => (reducedMotion.matches ? 'auto' : 'smooth');

function card(n: SiteNode): string {
  const lists = detailLists(n);
  // a case's diagram stays visible on the card, like its image; everything else sits under "More"
  const diagram = lists.filter((d) => d.kind === 'diagram').map((d) => `<h4>${d.title}</h4>${d.body}`).join('');
  const more = lists.filter((d) => d.kind !== 'diagram').map((d) => d.defaultOpen === false
    ? `<details class="m-more"><summary>${d.title}</summary>${d.body}</details>`
    : `<h4>${d.title}</h4>${d.body}`);
  // one visual per phone card: a case with a diagram shows only the diagram
  const media = (n.diagram ? [] : n.media || []).map(m => m.src
    ? `<button class="m-visual" data-visual-src="${esc(m.src)}"><img src="${esc(m.src)}" alt="${esc(t(m.alt))}" loading="lazy"/></button>`
    : `<div class="m-media">${L('visualsPrep')}</div>`).join('');
  return `<article class="m-card ${n.status ? 'is-prep' : ''}${matches(n.id) ? '' : ' is-off'}" id="m-${n.id}">
    <div class="m-card-type">${iconFor(n, 11)}<span>${esc(t(kindLabel(n.id)))}</span></div>
    ${intro(n, `<h3>${tx(n.label)}</h3>`)}
    ${diagram}
    ${media}
    ${more.length ? `<details class="m-more"><summary><span class="o">${L('more')}</span><span class="c">${L('less')}</span></summary>${more.join('')}</details>` : ''}
  </article>`;
}

function section(branchId: string): string {
  const b = byId.get(branchId)!;
  const kids = childrenOf(branchId);
  const hasSubs = kids.some((k) => k.type === 'sub');
  let inner = '';
  if (hasSubs) {
    // flagship cases first (as on the map and in the INDEX), then each group with its cases
    const flags = featuredOrder.map((id) => byId.get(id)!).filter((k) => k.parent === branchId);
    const flagHtml = flags.length ? `<div class="m-sub" id="m-flagships">
          <h3 class="m-sub-h">${icon('case', 10)}<span>${tx({ en: 'Flagship cases', zh: '重点案例' })}</span></h3>
          ${flags.map(card).join('')}
        </div>` : '';
    inner = flagHtml + kids
      .filter((k) => k.type === 'sub')
      .map(
        (s) => `<div class="m-sub" id="m-${s.id}">
          <h3 class="m-sub-h">${icon('sub', 10)}<span>${tx(s.label)}</span></h3>
          ${childrenOf(s.id).map(card).join('')}
        </div>`,
      )
      .join('');
  } else {
    inner = kids.map(card).join('');
  }
  return `<section class="m-sec" id="m-${b.id}">
    <h2 class="m-sec-h">${icon(kindOf(b.id), 12, false, true)}<span>${tx(b.label)}</span></h2>
    ${summary(b)}
    ${inner}
  </section>`;
}

function menu(): string {
  // the menu lists the Growth section's groups (v62.30: flagship cases lead their own group)
  const growth = childrenOf('growth').filter((s) => s.type === 'sub').map((s) => s.id)
    .map((id) => `<a href="#/${id}" class="m-menu-sub">${esc(t(byId.get(id)!.label))}</a>`)
    .join('');
  return `<nav class="m-menu" id="m-menu" aria-label="${L('menu')}">
    <div class="m-menu-quick">
      <a href="#/resume" class="btn">${L('resume')} →</a>
      <a href="#/contact" class="btn">${L('contact')} →</a>
    </div>
    <a href="#/growth" class="m-menu-item">${icon('branch', 11)}<span>${tx(byId.get('growth')!.label)}</span></a>
    <div class="m-menu-subs">${growth}</div>
    <a href="#/ai" class="m-menu-item">${icon('branch', 11)}<span>${tx(byId.get('ai')!.label)}</span></a>
    <a href="#/creative" class="m-menu-item">${icon('branch', 11)}<span>${tx(byId.get('creative')!.label)}</span></a>
    <a href="#/info" class="m-menu-item">${icon('branch', 11, true)}<span>${tx(byId.get('info')!.label)}</span></a>
  </nav>`;
}

/** Information: about me, then the résumé (experience + education), then contact. */
function info(): string {
  const i = byId.get('info')!, ex = byId.get('experience')!;
  return `<section class="m-sec" id="m-info">
    <h2 class="m-sec-h">${icon('branch', 12, true)}<span>${tx(i.label)}</span></h2>
    ${summary(i)}
  </section>
  <section class="m-sec" id="m-resume">
    <h2 class="m-sec-h">${icon('role', 12)}<span>${L('resume')}</span></h2>
    ${summary(ex)}
    <div class="cv-actions">${resumePdf()}</div>
    ${resumeLists(false)}
  </section>`;
}

function contact(): string {
  return `<section class="m-sec" id="m-contact">
    <h2 class="m-sec-h">${icon('info', 12)}<span>${L('contact')}</span></h2>
    ${contactRows()}
  </section>`;
}

export function renderMobile(root: HTMLElement) {
  root.innerHTML = `
    <header class="m-top">
      <a href="#/" class="m-brand"><span>${esc(site.name.toLowerCase())}</span></a>
      <button class="m-lang" data-lang="${state.lang === 'en' ? 'zh' : 'en'}" aria-label="${L('langAria')}">${L('langName')}</button>
    </header>
    ${filterSelects()}
    <div class="m-hero" id="m-home">
      ${astSvg(AST.phoneHero, 'm-hero-ast')}
      <h1>${esc(site.name)}</h1>
      <p class="p-kicker">${tx(site.tag)}</p>
      <p class="m-intro">${tx(site.intro)}</p>
    </div>
    ${menu()}
    ${section('growth')}
    ${section('ai')}
    ${section('creative')}
    ${info()}
    ${contact()}
    ${site.launched ? '' : `<footer class="m-foot"><span>${L('prototype')}</span></footer>`}
    <a href="#m-menu" class="m-fab" data-menu>${L('menu')}</a>
  `;
  root.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => {
    b.onclick = () => setLang(b.dataset.lang as 'en' | 'zh');
  });
  root.querySelector<HTMLAnchorElement>('[data-menu]')!.onclick = (e) => {
    e.preventDefault();
    document.getElementById('m-menu')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };
  // A link to the hash we're already on fires no hashchange: scroll anyway.
  root.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]').forEach((a) => {
    a.addEventListener('click', () => {
      if (a.getAttribute('href') === location.hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });
  wireFilters(root, () => {
    // after a choice, go to the first match: a case card, or the résumé for roles
    const hit = filtering() && (document.querySelector<HTMLElement>('.m-card:not(.is-off):not(.is-prep)') ?? document.getElementById('m-resume'));
    if (hit) hit.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  });
  wireCopy(root);
}

/** Scroll the phone page to the element for a route id. */
export function mobileScrollTo(id: string | null) {
  const target = id ? document.getElementById(`m-${id}`) : null;
  if (target) target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  else if (!id) window.scrollTo({ top: 0, behavior: scrollBehavior() });
}
