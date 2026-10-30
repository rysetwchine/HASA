# HASA — Deployment

HASA is two deployables:

| Piece | What it is | Where it belongs |
|---|---|---|
| **Client** | Static React + Vite SPA (`client/dist`) | Vercel (already configured) |
| **API** | Express 5 + `node:sqlite`, owns `hasa.sqlite` | A Node host **with a persistent disk** |

Vercel can serve the client, but it **cannot host this API**: serverless functions get an
ephemeral filesystem, so a SQLite file written by one invocation is gone by the next. That
is a hard constraint, not a configuration gap. Until the API has a home, the deployed site
will load and then fail every login and lesson call — an honest error from `lib/api.js`,
not a broken page.

---

## 1. Client on Vercel

### Settings

Two `vercel.json` files exist so either import style works. Vercel reads only the one in
the project's **Root Directory**.

**Option A — Root Directory = repository root** (uses `/vercel.json`)

| Setting | Value |
|---|---|
| Framework Preset | Other (ignore auto-detection) |
| Install Command | `npm ci --prefix client` |
| Build Command | `npm run build --prefix client` |
| Output Directory | `client/dist` |

**Option B — Root Directory = `client`** (uses `/client/vercel.json`)

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

The build script is the project's own `vite build`; nothing is overridden.

### SPA rewrites

```json
{ "source": "/((?!api/).*)", "destination": "/index.html" }
```

Deep links (`/student/aralin/3`, `/teacher/mga-ulat`) return `index.html` and React Router
takes over, so a refresh is never a 404. `/api/*` is deliberately excluded: with no API on
this host those requests should 404 rather than receive HTML.

Also configured: immutable caching for `/assets/*` and `/fonts/*`, `must-revalidate` for
`index.html`, and `nosniff` / `Referrer-Policy` / `X-Frame-Options` /
`Permissions-Policy` / HSTS headers.

### Environment variables (client)

| Name | Required | Example |
|---|---|---|
| `VITE_API_URL` | **yes in production** | `https://hasa-api.onrender.com` (no trailing `/api`) |
| `VITE_SITE_URL` | recommended | `https://hasa-xtg1.vercel.app` or your custom domain |

Only `VITE_*` values reach the browser bundle — never put a secret there. With
`VITE_API_URL` empty the client calls `/api` on its own origin, which only works behind a
same-origin proxy.

---

## 2. API on a persistent Node host

Any host that gives you a process **and a mounted disk** works: Render (with a disk),
Railway (with a volume), Fly.io (volume), a VPS, or a school server.

```bash
# Build/run
cd server
npm ci --omit=dev
NODE_ENV=production npm start      # node --env-file-if-exists=.env src/index.js
```

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | yes | `production` enables `assertProductionConfig()` and the SPA static fallback |
| `SESSION_SECRET` | yes | ≥ 32 chars; peppers the session-token HMAC. Rotating it logs everyone out |
| `DATABASE_PATH` | yes | absolute path **on the volume**, e.g. `/data/hasa.sqlite` |
| `CLIENT_ORIGIN` | yes | the Vercel origin. Sets `SameSite=None; Secure` cookies |
| `TEACHER_SIGNUP_CODE` | yes for teacher signup | blank = self-registration disabled (403 by design) |
| `TRUST_PROXY` | when behind a proxy | `1` on Render/Railway/Fly so `req.ip` and `secure` are right |
| `PORT` | usually injected | defaults to 3000 |
| `GEMINI_API_KEY` / `OPENAI_API_KEY` | optional | blank = AI reported as not configured |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Health check: `GET /api/health` → `{ "status": "ok" }`.
Config check: `GET /api/config` → shows grade, subject, and whether AI and teacher signup
are enabled (never keys).

### Back up the SQLite file

The database is a single file on the volume. Back it up by copying `hasa.sqlite` **plus**
`hasa.sqlite-wal` and `hasa.sqlite-shm` while the process is stopped, or run
`sqlite3 hasa.sqlite ".backup backup.sqlite"` while it is running. No scheduled backup is
configured by this repository — set one up in your host.

---

## 3. HTTPS and redirects

- Vercel serves the client over HTTPS automatically and redirects `http://` → `https://`;
  HSTS is set in `vercel.json`.
- The API host must also be HTTPS, otherwise browsers drop `Secure` cookies and login
  silently fails. Most hosts provision a certificate automatically; confirm it.
- Keep both origins on the same registrable domain when you can (e.g.
  `hasa.vercel.app` + `api.hasa.ph`), and list the exact client origin in `CLIENT_ORIGIN`
  — no trailing slash, no wildcard.
- HTTP-only requests to the API should redirect to HTTPS at the proxy/host level.

---

## 4. Custom domain

1. Add the domain in Vercel → Project → Settings → Domains, then point DNS as instructed.
2. Set the client env `VITE_SITE_URL=https://your-domain` and redeploy (canonical + OG tags
   are computed from it).
3. Update the absolute URLs in `client/public/sitemap.xml`, `client/public/robots.txt`, and
   the `<link rel="canonical">` / `og:url` in `client/index.html`.
4. Add the new origin to the API's `CLIENT_ORIGIN`. CORS fails closed otherwise.
5. Re-check `og-image.png` text if it mentions the old address.

---

## 5. SEO

`client/index.html` carries `lang="tl"`, a canonical link, Open Graph + Twitter tags, and
`EducationalOrganization` JSON-LD. `components/Seo.jsx` updates title, description,
canonical, OG/Twitter, and the robots directive per route:

- public `/` → `index, follow`
- `/login`, `/register`, `/student/*`, `/teacher/*`, `/404` → `noindex, nofollow`

`public/` also ships `robots.txt` (blocks `/student/`, `/teacher/`, `/login`, `/register`),
`sitemap.xml`, `llms.txt`, `site.webmanifest`, `favicon.svg`/`.png`/`.ico`, and
`apple-touch-icon.png`.

---

## 6. Verification performed

Reproduced the exact Vercel steps locally on the committed tree:

```
npm ci --prefix client        → 117 packages
npm run build --prefix client → ✓ built, lazy route chunks, no .map files
```

Served `client/dist` with filesystem-first + SPA fallback: `/`, `/student/dashboard`,
`/teacher/mga-ulat`, `/mga-aralin`, `/assets/*.js|css`, `/fonts/*.woff2`, `/favicon.svg`,
`/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og-image.png` all return 200 with the right
content type.

Automated tests: `cd server && npm test` → 24/24; `cd client && npm test` → 46/46
(12 format, 8 SEO, 6 guard, 20 end-to-end page renders).

The end-to-end file (`client/src/test/e2e.test.jsx`) opens every student and teacher
page against a running API and fails on any `console.error`. Point it at a server with
`HASA_E2E_API=http://127.0.0.1:3100` (and `HASA_E2E_SIGNUP_CODE`); it skips itself when
nothing is listening.

**Not verified:** the live Vercel URL after this change, and any browser interaction —
this sandbox cannot reach `vercel.com`, and no headless browser can be installed here.
After deploying, check: `/` loads, a hard refresh on `/student/dashboard` returns the app
(not 404), fonts render as Inter, the favicon appears, and `/login` reports a clear Tagalog
connection error until `VITE_API_URL` points at a running API.
