import snapshot from './published-copy.json';
import { nodes, site, ui } from './content';

type Edit = { text: string; ranges?: number[][]; blueRanges?: number[][]; boldRanges?: number[][] };
const formats = new WeakMap<object, Map<string, Edit>>();

/** Apply only the owner-approved current snapshot; private revision history stays local. */
export function applyPublishedCopy() {
  const targets = new Map<string, { object: any; prop: string }>();
  const arrays = new Map<string, any[]>();
  function walk(object: any, path: string) {
    if (Array.isArray(object)) arrays.set(path, object);
    for (const [prop, value] of Object.entries(object)) {
      const key = `${path}.${prop}`;
      if (typeof value === 'string') targets.set(key, { object, prop });
      else if (value && typeof value === 'object') walk(value, key);
    }
  }
  walk(site, 'site'); walk(ui, 'ui'); nodes.forEach(n => walk(n, `nodes.${n.id}`));
  for (const [key, ids] of Object.entries(snapshot.lists)) {
    const array = arrays.get(key); if (!array) throw new Error(`Missing copy list: ${key}`);
    const items = ids.map(id => {
      if (!id.startsWith('added-')) return array[Number(id)];
      const item = { en: '', zh: '', metric: '' }; walk(item, `${key}.${id}`); return item;
    });
    array.splice(0, array.length, ...items);
  }
  for (const [key, edit] of Object.entries(snapshot.edits) as [string, Edit][]) {
    const target = targets.get(key); if (!target) throw new Error(`Missing copy field: ${key}`);
    target.object[target.prop] = edit.text;
    let fields = formats.get(target.object);
    if (!fields) { fields = new Map(); formats.set(target.object, fields); }
    fields.set(target.prop, edit);
  }
}

export function publishedMarkup(object: object, prop: string, escape: (s: string) => string): string | undefined {
  const edit = formats.get(object)?.get(prop); if (!edit) return;
  const ranges = edit.ranges ?? [], blue = edit.blueRanges ?? [], bold = edit.boldRanges ?? [];
  const cuts = [...new Set([0, edit.text.length, ...ranges.flat(), ...blue.flat(), ...bold.flat()])].sort((a,b) => a-b);
  return cuts.slice(0, -1).map((start, i) => {
    const end = cuts[i + 1];
    const has = (r: number[][]) => r.some(([a,b]) => a <= start && b >= end);
    const classes = [has(ranges) ? 'published-highlight' : '', has(blue) ? 'published-blue' : '', has(bold) ? 'published-bold' : ''].filter(Boolean).join(' ');
    const text = escape(edit.text.slice(start, end));
    return classes ? `<span class="${classes}">${text}</span>` : text;
  }).join('');
}
