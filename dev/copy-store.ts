import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

/** Dev server only. Archives are outside public/ and never enter a build. */
export function copyStore(): Plugin {
  const dir = resolve('.copy-editor');
  const file = resolve(dir, 'archive.json');
  let revision = 0;
  return {
    name: 'local-copy-archive', apply: 'serve',
    configureServer(server) {
      server.watcher.add(file);
      server.watcher.unwatch(dir);
      server.middlewares.use('/__copy_archive', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        const host = req.headers.host || '';
        if (!/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host) ||
            (req.headers.origin && req.headers.origin !== `http://${host}`)) {
          res.statusCode = 403; res.end('{}'); return;
        }
        const read = () => existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { revision: 0, originals: {}, edits: {}, history: [] };
        if (req.method === 'GET') { res.end(JSON.stringify(read())); return; }
        if (req.method !== 'POST' || !req.headers['content-type']?.startsWith('application/json')) {
          res.statusCode = 405; res.end('{}'); return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; if (body.length > 5_000_000) req.destroy(); });
        req.on('end', () => {
          try {
            const input = JSON.parse(body); const archive = read();
            if (input.revision !== archive.revision) { res.statusCode = 409; res.end(JSON.stringify({ error: '另一窗口已保存，请刷新后继续。' })); return; }
            if (!input.edits || !input.originals || typeof input.edits !== 'object' || Array.isArray(input.edits)) throw new Error('Invalid archive');
            for (const value of Object.values(input.edits) as any[]) {
              if (!value || typeof value.text !== 'string' || value.text.length > 50000 || !Array.isArray(value.ranges) || !value.ranges.every((r: any) => Array.isArray(r) && r.length === 2 && Number.isInteger(r[0]) && Number.isInteger(r[1]) && r[0] >= 0 && r[1] > r[0] && r[1] <= value.text.length)) throw new Error('Invalid text');
              if (value.blueRanges !== undefined && (!Array.isArray(value.blueRanges) || !value.blueRanges.every((r: any) => Array.isArray(r) && r.length === 2 && Number.isInteger(r[0]) && Number.isInteger(r[1]) && r[0] >= 0 && r[1] > r[0] && r[1] <= value.text.length))) throw new Error('Invalid emphasis');
              if (value.boldRanges !== undefined && (!Array.isArray(value.boldRanges) || !value.boldRanges.every((r: any) => Array.isArray(r) && r.length === 2 && Number.isInteger(r[0]) && Number.isInteger(r[1]) && r[0] >= 0 && r[1] > r[0] && r[1] <= value.text.length))) throw new Error('Invalid emphasis');
            }
            const lists = input.lists ?? archive.lists ?? {};
            if (!lists || typeof lists !== 'object' || Array.isArray(lists)) throw new Error('Invalid lists');
            for (const [key, ids] of Object.entries(lists)) {
              if (!/^nodes\.[a-z0-9-]+\.(sections\.\d+\.items|results)$/.test(key) || !Array.isArray(ids) || ids.length > 200 || new Set(ids).size !== ids.length || !ids.every(id => typeof id === 'string' && /^(\d+|added-[a-f0-9-]{36})$/.test(id))) throw new Error('Invalid list items');
            }
            revision = archive.revision + 1;
            const next = { revision, originals: { ...input.originals, ...archive.originals }, edits: input.edits, lists,
              history: [...archive.history, { at: new Date().toISOString(), edits: input.edits, lists }] };
            mkdirSync(dir, { recursive: true });
            writeFileSync(file + '.tmp', JSON.stringify(next, null, 2)); renameSync(file + '.tmp', file);
            res.end(JSON.stringify({ revision }));
          } catch { res.statusCode = 400; res.end(JSON.stringify({ error: '存档失败，修改仍留在当前页面。' })); }
        });
      });
    },
  };
}
