# Wenyi Zhu — portfolio (Claude prototype)

Status: **design final · content in progress**. Progress: `docs/STATUS.md` · Design: `docs/SPEC.md` · History: `docs/CHANGELOG.md` · Mistakes → rules: `docs/LESSONS.md` · Rules for Claude: `CLAUDE.md`.

## Look at it

- Easiest: double-click **`preview.html`** — the whole site in one file, opens in any browser, no install.
- Live-editing version (needs Node.js): `npm install`, then `npm run dev`, and open the address it prints.

## Where to change things

| What | File |
|---|---|
| All text, cases, links, placeholders (EN / 中文) | `src/content.ts` |
| Colours, fonts, layout sizes | `src/style.css` (top `:root` block only) |
| Map layout & camera tuning | config objects at the top of `src/map.ts` |
| Shapes | `src/shapes.ts` |
| Content blocks shared by desktop card and phone page | `src/blocks.ts` |
| Right-hand card layout | `src/panel.ts` |
| Phone layout (one page) | `src/mobile.ts` |
| Page title, share preview, favicon | generated in `vite.config.ts` — don't edit `index.html` |

Placeholders still open: public email and résumé PDF (`site` in `src/content.ts`), images (`media` on each case), AI projects, Creative Work pieces.

## Publish on GitHub Pages

1. Create a new GitHub repository and upload the contents of this folder (not `node_modules` / `dist`).
2. In the repository: Settings → Pages → Source: **GitHub Actions**.
3. Put `github-pages-deploy.yml` at `.github/workflows/deploy.yml` in the repository (GitHub's web editor: Add file → Create new file, paste it). From then on, every push to `main` builds and publishes automatically.

Links to a node look like `…/#/ua-creative-strategy`, which works on GitHub Pages.

## Build commands

- `npm run check` → guardrails (hard-coded colours/sizes, breakpoints, dead strings, content links); runs automatically before every build
- `npm run check -- --launch` → go-live gate (no placeholders, email + résumé set, `site.launched: true`)
- `npm run build` → static site in `dist/`
- `npm run build:file` → also regenerates `preview.html`
