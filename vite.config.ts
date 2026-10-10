import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { copyStore } from './dev/copy-store';
import { llmsTxt, wenyiMd } from './dev/readable';
import { site } from './src/content';
import { astIcon } from './src/shapes';

/*
 * index.html is not hand-written: its title, description, share (Open Graph) tags,
 * favicon and no-JavaScript fallback are generated here from the same sources the
 * site uses — src/content.ts for text, the --cobalt token in src/style.css for colour —
 * so nothing in the HTML can drift from the site.
 */
const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function token(name: string): string {
  const css = readFileSync(new URL('./src/style.css', import.meta.url), 'utf8');
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`style.css has no --${name} token`);
  return m[1].trim();
}

/** The first family of a font token, as a Google Fonts family parameter. */
const family = (name: string) => token(name).split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');

function headFromContent(): Plugin {
  return {
    name: 'head-from-content',
    transformIndexHtml(html) {
      const title = `${site.name} — ${site.tag.en}`;
      const desc = site.metaDescription.en;
      const icon = astIcon(token('cobalt'));
      const meta = [
        `<title>${escAttr(title)}</title>`,
        `<meta name="description" content="${escAttr(desc)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escAttr(title)}" />`,
        `<meta property="og:description" content="${escAttr(desc)}" />`,
        `<meta name="twitter:card" content="summary" />`,
        `<meta name="theme-color" content="${escAttr(token('bg'))}" />`,
        `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}" />`,
        `<link rel="alternate" type="text/markdown" href="wenyi.md" title="${escAttr(site.name)}: plain-text portfolio" />`, // v73.9: for AI agents
        // the web font is the first family in --sans: change the font in one place (style.css); 600/800 and the serif are for the travel card (v76)
        `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
        `<link href="https://fonts.googleapis.com/css2?family=${family('sans')}:wght@400;500;600;800&family=${family('hand')}&family=${family('serif')}:ital@1&display=swap" rel="stylesheet" />`,
      ].join('\n    ');
      const noscript = `<noscript><p>${escAttr(desc)} <a href="${escAttr(site.linkedin)}">LinkedIn</a></p></noscript>`;
      return html
        .replace(/<!-- head:meta[^>]*-->/, meta)
        .replace('<!-- head:noscript -->', noscript);
    },
  };
}

/** v73.9 (owner): /wenyi.md and /llms.txt, generated from the content (dev/readable.ts). */
function aiReadable(): Plugin {
  const files: Record<string, () => string> = { 'wenyi.md': wenyiMd, 'llms.txt': llmsTxt };
  return {
    name: 'ai-readable',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const f = files[(req.url || '').split('?')[0].replace(/^\//, '')];
        if (!f) return next();
        res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end(f());
      });
    },
    generateBundle() {
      for (const [fileName, f] of Object.entries(files)) this.emitFile({ type: 'asset', fileName, source: f() });
    },
  };
}

// Relative base so the built site works on GitHub Pages under any repo name.
export default defineConfig({
  base: './',
  plugins: [headFromContent(), copyStore(), aiReadable()],
});
