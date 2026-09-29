import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { copyStore } from './dev/copy-store';
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
        // the web font is the first family in --sans: change the font in one place (style.css)
        `<link rel="preconnect" href="https://fonts.googleapis.com" />`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`,
        `<link href="https://fonts.googleapis.com/css2?family=${token('sans').split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+')}:wght@400;500&display=swap" rel="stylesheet" />`,
      ].join('\n    ');
      const noscript = `<noscript><p>${escAttr(desc)} <a href="${escAttr(site.linkedin)}">LinkedIn</a></p></noscript>`;
      return html
        .replace(/<!-- head:meta[^>]*-->/, meta)
        .replace('<!-- head:noscript -->', noscript);
    },
  };
}

// Relative base so the built site works on GitHub Pages under any repo name.
export default defineConfig({
  base: './',
  plugins: [headFromContent(), copyStore()],
});
