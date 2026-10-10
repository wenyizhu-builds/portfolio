/**
 * v73.9 (owner): a plain-text version of the portfolio for AI assistants and screen readers.
 * Served as /wenyi.md and /llms.txt in dev (middleware) and emitted into the build, so it is always
 * generated from src/content.ts + the published copy and can never drift from the cards.
 */
import { readFileSync } from 'node:fs';
import { nodes as baseNodes, site as baseSite, indexSections, rolesOrder, schoolsOrder, type SiteNode } from '../src/content.ts';

type T = { en: string; zh?: string };
const en = (x: any): string => (x && typeof x === 'object' && 'en' in x ? x.en : x ?? '') as string;

/** content.ts with the owner-approved published copy applied (the same rules as src/published-copy.ts). */
function load() {
  const nodes: SiteNode[] = structuredClone(baseNodes);
  const site: any = { ...structuredClone({ ...baseSite, intro: undefined }), introLines: structuredClone(baseSite.introLines) };
  const snap = JSON.parse(readFileSync(new URL('../src/published-copy.json', import.meta.url), 'utf8'));
  const targets = new Map<string, { o: any; p: string }>(), arrays = new Map<string, any[]>();
  const walk = (o: any, path: string) => {
    if (Array.isArray(o)) arrays.set(path, o);
    for (const [p, v] of Object.entries(o)) { const k = `${path}.${p}`; if (typeof v === 'string') targets.set(k, { o, p }); else if (v && typeof v === 'object') walk(v, k); }
  };
  walk(site, 'site'); nodes.forEach((n) => walk(n, `nodes.${n.id}`));
  for (const [key, ids] of Object.entries(snap.lists as Record<string, string[]>)) {
    const a = arrays.get(key); if (!a) continue;
    const items = ids.map((id) => { if (!id.startsWith('added-')) return a[Number(id)]; const it = { en: '', zh: '', metric: '' }; walk(it, `${key}.${id}`); return it; });
    a.splice(0, a.length, ...items);
  }
  for (const [key, e] of Object.entries(snap.edits as Record<string, { text: string }>)) { const t = targets.get(key); if (t) t.o[t.p] = e.text; }
  return { nodes, site, byId: new Map(nodes.map((n) => [n.id, n])) };
}

export function wenyiMd(): string {
  const { nodes, site, byId } = load();
  const kids = (id: string) => nodes.filter((n) => n.parent === id);
  const L: string[] = [];
  L.push(`# ${site.name}`, '', `**${en(site.tag)}**`, '');
  L.push('> Plain-text version of my portfolio, written for AI assistants and screen readers. The interactive site has the same content as a metro map.', '');
  for (const l of site.introLines) L.push(`- **${en(l.lead)}** ${l.en}`);
  const info = byId.get('info');
  if (info?.summary) L.push('', '## About', '', en(info.summary));
  L.push('', '## Contact', '', `- LinkedIn: ${site.linkedin}`);
  if (site.email) L.push(`- Email: ${site.email}`);

  const work = (n: SiteNode, depth: string) => {
    const org = n.org ? byId.get(n.org) : undefined;
    L.push('', `${depth} ${en(n.label)}`, '');
    const meta = [org ? en(org.label) : n.org === '' ? 'Personal project' : '', en(n.context), n.period, (n.markets || []).join(', '), (n.tags || []).map(en).join(', ')].filter(Boolean);
    if (meta.length) L.push(`*${meta.join(' · ')}*`, '');
    if (n.summary) L.push(en(n.summary), '');
    if (n.results?.length) { L.push('Results:'); n.results.forEach((r: any) => L.push(`- ${[r.metric, en(r)].filter(Boolean).join(' ')}`)); L.push(''); }
    for (const s of n.sections || []) { L.push(`${en(s.title)}:`); s.items.forEach((i) => L.push(`- ${en(i)}`)); L.push(''); }
    if (n.team && en(n.team)) L.push(`Team: ${en(n.team)}`, '');
    (n.links || []).forEach((l) => L.push(`- ${en(l.label)}: ${l.href}`));
  };
  for (const sec of indexSections.filter((id) => !['experience', 'education', 'creative'].includes(id))) {
    const g = byId.get(sec)!; L.push('', `## ${en(g.label)}`, ''); if (g.summary) L.push(en(g.summary));
    const walk = (id: string) => kids(id).forEach((k) => (kids(k.id).length ? walk(k.id) : work(k, '###')));
    walk(sec);
  }
  L.push('', '## Experience');
  for (const id of rolesOrder) {
    const r = byId.get(id)!;
    L.push('', `### ${en(r.label)} · ${en(r.kicker)}`, '', `*${[r.period, r.markets?.length ? `Markets: ${r.markets.join(', ')}` : ''].filter(Boolean).join(' · ')}*`, '');
    if (r.summary) L.push(en(r.summary), '');
    for (const s of r.sections || []) s.items.forEach((i) => L.push(`- ${en(i)}`));
  }
  L.push('', '## Education');
  for (const id of schoolsOrder) {
    const s = byId.get(id)!;
    L.push('', `### ${en(s.label)} · ${en(s.kicker)}`, '', `*${[s.period, en((s as any).place)].filter(Boolean).join(' · ')}*`, '');
    if (s.summary) L.push(en(s.summary), '');
    for (const sec of s.sections || []) sec.items.forEach((i) => L.push(`- ${en(i)}`));
  }
  L.push('', '## Languages', '', 'English and Chinese; Japanese at JLPT N1, the highest level.', '');
  return L.join('\n').replace(/\n{3,}/g, '\n\n');
}

export function llmsTxt(): string {
  const { site } = load();
  return [
    `# ${site.name}`, '',
    `> ${en(site.metaDescription)}`, '',
    'This site is an interactive portfolio drawn as a metro map. The full content is available as plain text:', '',
    '## Portfolio', '',
    '- [Portfolio in plain text](wenyi.md): bio, every case study with results, experience, education and languages',
    `- [LinkedIn](${site.linkedin})`, '',
  ].join('\n');
}
