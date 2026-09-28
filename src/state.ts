import { childrenOf, type Lang, type T } from './content';

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
