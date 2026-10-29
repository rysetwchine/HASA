# HASA — Vercel Deployment

The frontend is a static React + Vite SPA. It needs **no environment variables** and
**no server**; `npm run build` emits `client/dist`, and Vercel serves it with an SPA
rewrite so refreshing any route returns `index.html` instead of a 404.

Files that make this work (added for deployment, nothing else changed):

| File | Purpose |
|---|---|
| `vercel.json` | Build/install commands, output directory, SPA rewrite, cache headers — used when the Vercel **Root Directory is the repo root** |
| `client/vercel.json` | Same settings, used when the **Root Directory is `client`** |
| `.vercelignore` | Keeps `server/`, `docs/`, `.design/`, tests and build output out of the upload |

Vercel reads `vercel.json` only from the project’s Root Directory, so having both files is
safe — exactly one of them applies.

---

## Option A — Root Directory: repository root (default)

Import the repo, change nothing in the settings, and Vercel uses `vercel.json`:

| Setting | Value |
|---|---|
| Framework Preset | Other (auto-detected, ignore it) |
| Install Command | `npm ci --prefix client` |
| Build Command | `npm run build --prefix client` |
| Output Directory | `client/dist` |
| Node.js Version | 22.x (default; Vite 8 needs ≥ 20.19 / 22.12) |

## Option B — Root Directory: `client`

Simpler if the dashboard asks for a folder: set **Root Directory = `client`**, keep the
Vite preset, and `client/vercel.json` supplies the rewrite:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm ci` (default) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Either way the build is the unmodified project script — `"build": "vite build"` — and the
output is the standard Vite `dist` folder.

---

## Client-side routing

`src/main.jsx` uses `BrowserRouter`, so every route is a real URL:
`/`, `/mga-aralin`, `/mga-aralin/lesson-1-5`, `/aktibidad?activity=ch3`, `/pag-unlad`,
`/mga-nakamit`, `/misyon`, `/pasimplehin`, `/guro`, `/login`, `/register`.

The rewrite in both `vercel.json` files:

```json
{ "source": "/(.*)", "destination": "/index.html" }
```

Vercel checks the filesystem **before** applying rewrites, so `/assets/*.js`,
`/fonts/*.woff2`, `/favicon.png` are served as real files and only unknown paths fall
back to the SPA shell. A hard refresh on a deep link therefore returns 200 + the app.

---

## Environment variables

None are required.

- The frontend contains **zero** `import.meta.env` / `process.env` reads, so there is
  nothing to configure in the Vercel dashboard and nothing secret can leak into the bundle
  (a `VITE_*` value is compiled into public JavaScript by definition).
- `.env` is gitignored; `.env.example` is a template with **empty** values and documents
  server-only names (`SESSION_SECRET`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, …) that belong
  to the future backend in `server/`, not to this static deploy.
- The app makes no network calls in this stage (`services/api.js` deliberately throws
  “Wala pang koneksyon sa server sa yugtong ito.”), so the dev-only `/api` proxy in
  `vite.config.js` is irrelevant in production.
- Progress/XP/badges live in the browser’s `localStorage`, per visitor — nothing to set up.

If a backend is added later, it must be a separate deployment and the frontend should reach
it via a Vercel rewrite (same-origin) rather than a bundled key.

---

## Verification already performed locally

Ran the exact commands Vercel runs, from a clean copy of the tracked files:

```
npm ci --prefix client      → 117 packages installed
npm run build --prefix client → ✓ built in 688ms → client/dist
```

Then served `client/dist` with filesystem-first + SPA-fallback behaviour (mimicking Vercel):

| Request | Result |
|---|---|
| `/` | 200 text/html |
| `/mga-aralin` | 200 text/html (deep link, no 404) |
| `/mga-aralin/lesson-1-5` | 200 text/html |
| `/mga-aralin/lesson-2-3` | 200 text/html |
| `/aktibidad?activity=ch3` | 200 text/html |
| `/pag-unlad`, `/login` | 200 text/html |
| `/assets/index-*.js` | 200 text/javascript, 532,906 bytes |
| `/assets/index-*.css` | 200 text/css, 85,615 bytes |
| `/fonts/*.woff2` | 200 font/woff2 |
| `/favicon.png` | 200 image/png |

Assets and styles: `dist/assets` contains the 18 imported images (hashed, cacheable
forever), the JS bundle and the CSS bundle; `dist/fonts` contains the 25 self-hosted woff2
files and all 25 URLs referenced from the built CSS resolve to a real file (0 missing).

---

## What still needs a human

1. **Trigger the deploy.** The Vercel account is not connected to this session, and the
   sandbox cannot reach `api.vercel.com`, so nothing has been published yet. Connect Vercel
   in Arena, or import `rysetwchine/HASA` in the Vercel dashboard.
2. **First-deploy check on the live URL:** open the root, then hard-refresh
   `/mga-aralin/lesson-1-5` (must not 404), then check that the fonts load (the UI should
   show Inter/Playfair, not a system fallback) and that the Araling Panlipunan banner
   illustration renders.
3. **Add a project name** — e.g. `hasa` → `https://hasa.vercel.app`. Existing Vercel
   projects are not modified: importing the repo creates a new project.

## Rollback / no-overwrite notes

- No existing Vercel project, domain or deployment is deleted or overwritten by this
  configuration.
- The GitHub repository is unchanged in structure: three additive files
  (`vercel.json`, `client/vercel.json`, `.vercelignore`) plus this document.
- A failed deploy is fixed by reverting `vercel.json`; `git revert <commit>` restores the
  previous state without touching app code.
