import { byId, childrenOf, filterSets, regionOfMarket, type Lang, type PlatformKey, type RegionKey, type T } from './content';

type Listener = () => void;
const listeners = new Set<Listener>();

function readLang(): Lang {
  try {
    const v = localStorage.getItem('lang');
    if (v === 'zh' || v === 'en') return v;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

export const state = {
  lang: readLang() as Lang,
  visited: new Set<string>(),
};

export function setLang(lang: Lang) {
  state.lang = lang;
  try {
    localStorage.setItem('lang', lang);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  listeners.forEach((l) => l());
}

/* ---------- Filters (v60): kept in the address (?platform=…&region=…) so a filtered view can be shared ---------- */
export type FilterKind = keyof typeof filterSets;
export const filters: { platform: PlatformKey | null; region: RegionKey | null } = { platform: null, region: null };
try {
  const q = new URLSearchParams(location.search);
  const p = q.get('platform'), r = q.get('region');
  if (p && p in filterSets.platform.options) filters.platform = p as PlatformKey;
  if (r && r in filterSets.region.options) filters.region = r as RegionKey;
} catch {
  /* malformed address: no filter */
}

/** Pick an option, or clear it when it is picked again. */
export function toggleFilter(kind: FilterKind, key: string) {
  (filters as Record<FilterKind, string | null>)[kind] = filters[kind] === key ? null : key;
  try {
    const q = new URLSearchParams(location.search);
    (Object.keys(filters) as FilterKind[]).forEach((k) => (filters[k] ? q.set(k, filters[k]!) : q.delete(k)));
    const s = q.toString();
    history.replaceState(null, '', `${location.pathname}${s ? `?${s}` : ''}${location.hash}`);
  } catch {
    /* address can't be updated: the filter still works on this page */
  }
  listeners.forEach((l) => l());
}

/** One rule for the map, the INDEX and the phone list: a piece of work matches every chosen filter;
    a group matches when anything inside it does. Nothing chosen = everything matches. */
export function matches(id: string): boolean {
  if (!filters.platform && !filters.region) return true;
  if (id === 'root') return true;
  const n = byId.get(id);
  if (!n) return true;
  const kids = childrenOf(id);
  if (kids.length) return kids.some((k) => matches(k.id));
  const okP = !filters.platform || (n.platforms ?? []).includes(filters.platform);
  const okR = !filters.region || (n.markets ?? []).some((m) => regionOfMarket[m] === filters.region);
  return okP && okR;
}

export function onChange(l: Listener) {
  listeners.add(l);
}

/** Localized text. Falls back to English. */
export function t(v: T | undefined): string {
  if (!v) return '';
  return (state.lang === 'zh' && v.zh) || v.en;
}

/** True when Chinese is selected but this text has no Chinese version. */
export function missingZh(v: T | undefined): boolean {
  return state.lang === 'zh' && !!v && !v.zh && !!v.en;
}

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/* ---------- Routing: #/<node-id>, #/resume, #/contact ---------- */
export type Route = { kind: 'home' } | { kind: 'node'; id: string } | { kind: 'resume' } | { kind: 'contact' };

export function parseRoute(): Route {
  const raw = location.hash.replace(/^#\/?/, '');
  let h = raw;
  try {
    h = decodeURIComponent(raw);
  } catch {
    return { kind: 'home' }; // malformed link: go home rather than crash
  }
  if (!h || h === 'root') return { kind: 'home' };
  if (h === 'resume') return { kind: 'resume' };
  if (h === 'contact') return { kind: 'contact' };
  return { kind: 'node', id: h };
}

export function go(path: string) {
  const target = path ? `#/${path}` : '#/';
  if (location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = target;
  }
}

/* "Seen" — one rule for the map and the card (L17): a single item once opened; a group
   only when every item inside it has been opened. Opening the group itself doesn't count. */
export function isDone(id: string): boolean {
  const kids = childrenOf(id);
  if (!kids.length) return state.visited.has(id);
  return kids.every((k) => isDone(k.id));
}
