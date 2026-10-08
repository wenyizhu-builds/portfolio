import { byId, childrenOf, filterSets, regionOfMarket, rides, type Lang, type PlatformKey, type RegionKey, type RideKey, type T } from './content';

type Listener = () => void;
const listeners = new Set<Listener>();

// English only for now (owner, 2026-10-03): no Chinese version. The zh strings stay in
// content.ts, unused; to bring Chinese back, restore the language switch and read the saved choice here.
function readLang(): Lang {
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

/* ---------- Curate your ride (v71): a ride, a target market and a platform, kept in the address
   (?ride=…&region=…&platform=…) so a curated view can be shared ---------- */
export type FilterKind = keyof typeof filterSets;
export const filters: { ride: RideKey | null; region: RegionKey | null; platform: PlatformKey | null } = { ride: null, region: null, platform: null };
try {
  const q = new URLSearchParams(location.search);
  (Object.keys(filters) as FilterKind[]).forEach((k) => {
    const v = q.get(k);
    if (v && v in filterSets[k].options) (filters as Record<FilterKind, string | null>)[k] = v;
  });
} catch {
  /* malformed address: no filter */
}

/** A ready-made ride is a whole selection on its own (owner, v72.1): picking one clears target market and platform,
    and picking either of those clears the ride. Target market and platform combine freely. */
function exclusive(picked: FilterKind) {
  const f = filters as Record<FilterKind, string | null>;
  if (picked === 'ride') { f.region = null; f.platform = null; } else f.ride = null;
}
if (filters.ride) exclusive('ride'); // an address with both: the ride wins

export const filtering = () => !!(filters.ride || filters.region || filters.platform);

/** Pick an option, or clear it when it is picked again. */
export function toggleFilter(kind: FilterKind, key: string) {
  setFilter(kind, filters[kind] === key ? null : key);
}
/** Set one filter (null = all) and keep the address in step. */
export function setFilter(kind: FilterKind, key: string | null) {
  (filters as Record<FilterKind, string | null>)[kind] = key;
  if (key) exclusive(kind);
  syncUrl();
  listeners.forEach((l) => l());
}
/** The phone has no map, so no rides (owner, v72.3): a shared ride link opens with the ride dropped, quietly. */
export function dropRide() {
  if (!filters.ride) return;
  filters.ride = null;
  syncUrl();
}
function syncUrl() {
  try {
    const q = new URLSearchParams(location.search);
    (Object.keys(filters) as FilterKind[]).forEach((k) => (filters[k] ? q.set(k, filters[k]!) : q.delete(k)));
    const s = q.toString();
    history.replaceState(null, '', `${location.pathname}${s ? `?${s}` : ''}${location.hash}`);
  } catch {
    /* address can't be updated: the filter still works on this page */
  }
}

/** One rule for the map, the INDEX and the phone list: a piece of work matches every chosen filter;
    a group matches when anything inside it does. Nothing chosen = everything matches. */
export function matches(id: string): boolean {
  if (!filtering()) return true;
  if (id === 'root') return true;
  const n = byId.get(id);
  if (!n) return true;
  const kids = childrenOf(id);
  if (kids.length) return kids.some((k) => matches(k.id));
  if (n.status) return false; // a placeholder has nothing to show for any filter
  if (filters.ride && !rides[filters.ride].stops.includes(id)) return false;
  if (filters.region && !(n.markets ?? []).some((m) => regionOfMarket[m] === filters.region)) return false;
  if (filters.platform && !(n.platforms ?? []).includes(filters.platform)) return false;
  return true;
}

/** Clear the whole ride (all three choices) in one step. */
export function clearFilters() {
  (Object.keys(filters) as FilterKind[]).forEach((k) => ((filters as Record<FilterKind, string | null>)[k] = null));
  setFilter('ride', null);
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
