# HASA — Deployment

HASA is three free pieces that fit together:

| Piece | What it is | Where it belongs | Cost |
|---|---|---|---|
| **Client** | Static React + Vite SPA (`client/dist`) | Vercel Free (already configured) | free |
| **API** | Express 5 on Node ≥ 22.9, async DB layer | Render Free web service | free (sleeps when idle) |
| **Database** | Turso Cloud (libSQL) in production; `node:sqlite` file locally | Turso Free | free |

Vercel can serve the client, but it **cannot host this API**: serverless functions get an
ephemeral filesystem and a per-request lifetime. Render Free has an ephemeral filesystem
too — that is why the authoritative data lives in **Turso**, not on the disk. A local
SQLite file remains fully supported for development, tests, and any host that has a
volume (`DATABASE_DRIVER=local`).

Until the API has a home, the deployed site will load and then fail every login and
lesson call — an honest error from `lib/api.js`, not a broken page.

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

Deep links (`/student/aralin/3`, `/teacher/progreso`, `/teacher/mga-ulat`) return `index.html` and React Router
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

## 2. API on Render Free + Turso Cloud

Free-only stack: **Vercel Free** (client) + **Render Free** web service (API) +
**Turso Cloud Free** (database). Render Free has **no persistent disk**, so the
authoritative database must live in Turso. A local SQLite file is still supported for
development, tests, and any host that does have a volume.

### 2.1 How the database layer works

`server/src/db/database.js` exposes one async API over two drivers:

| Driver | When | Notes |
|---|---|---|
| `local` | no `TURSO_DATABASE_URL` (dev, tests, volume hosts) | `node:sqlite`, WAL, prepared-statement cache |
| `turso` | `TURSO_DATABASE_URL` is set | `@libsql/client` (`libsql://…`), one round trip per statement |

Every call site is awaited, so the same code runs on either driver:

```js
const row = await db.prepare("SELECT … WHERE id = ?").get(id);
await db.transaction(async (tx) => { await tx.prepare("INSERT …").run(a, b); });
```

- Transactions use `BEGIN IMMEDIATE`/`COMMIT`/`ROLLBACK` locally and
  `client.transaction("write")` on Turso — quiz submission + XP + badges stay atomic.
- Duplicate XP is prevented by the unique index `idx_points_once`
  (`student_id, reason_code, ref_type, ref_id`) plus `INSERT OR IGNORE`, so it holds on
  both drivers regardless of retries.
- The schema in `server/src/db/schema.js` contains no PRAGMAs: foreign keys are always
  on in Turso and are enabled explicitly by the local driver only.
- `GET /api/health` is database-free; `/api/config` reports the driver-independent config.

### 2.2 Create the Turso database and migrate existing data

```bash
# 1. Install the Turso CLI, sign in, create the database
turso auth login
turso db create hasa
turso db show hasa --url              # libsql://hasa-<org>.turso.io
turso db tokens create hasa           # TURSO_AUTH_TOKEN (server-only)
```

Then copy the local rows (student accounts, hashes, sessions, progress, XP, badges,
quiz attempts) into Turso. The script is idempotent (`INSERT OR REPLACE` with original
ids), runs inside one deferred-FK transaction, and **verifies row counts and relations**
before it exits successfully:

```bash
cd server

# 0. Always dry-run first — reads and counts only
DATABASE_PATH=./data/hasa.sqlite \
TURSO_DATABASE_URL=libsql://hasa-<org>.turso.io \
TURSO_AUTH_TOKEN=… \
npm run migrate:dry-run

# 1. Real run: backs up the local file first, then copies
DATABASE_PATH=./data/hasa.sqlite \
TURSO_DATABASE_URL=libsql://hasa-<org>.turso.io \
TURSO_AUTH_TOKEN=… \
npm run migrate:to-turso

# 2. Later re-checks (e.g. after cutover)
… npm run migrate:verify
```

The script prints a per-table comparison and refuses to pass if anything is off:

```
  ✔ users            local=2 turso=2
  ✔ lesson_progress  local=1 turso=1
  ✔ points_ledger    local=4 turso=4
  ✔ students_without_class: 0
```

**Backups and rollback**

- Before writing, the script copies the local database (plus `-wal`/`-shm`) to
  `server/backups/hasa-<timestamp>.sqlite` (git-ignored). Nothing in Turso is ever
  deleted by the migration — it only inserts/replaces rows.
- The migration **never modifies the source database**; rollback is simply “point the
  API back at the file”: unset `TURSO_DATABASE_URL` (or set `DATABASE_DRIVER=local` with
  `DATABASE_PATH`) and restart.
- Turso keeps its own backups/point-in-time restore on paid plans; on the free plan take
  your own dump: `turso db shell hasa ".dump" > backups/hasa-$(date +%F).sql`,
  and restore with `turso db shell hasa < backups/hasa-YYYY-MM-DD.sql`.
- Keep the last local `.sqlite` file and the `backups/` folder until you have verified
  the live site for a full week.

### 2.3 Deploy on Render Free

`render.yaml` at the repo root is a Blueprint: **New → Blueprint → pick the repo**.

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm ci` |
| Start Command | `npm start` (`node --env-file-if-exists=.env src/index.js`) |
| Health Check Path | `/api/health` |
| Instance Type | Free |
| Node version | `22.x` or newer (`engines.node >= 22.9.0`) |

Environment variables (Render → Settings → Environment):

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | yes | `production` |
| `TURSO_DATABASE_URL` | **yes** | `libsql://hasa-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | **yes** | server-only secret; never in the client bundle |
| `SESSION_SECRET` | yes | ≥ 32 chars (`generateValue: true` in the blueprint) |
| `CLIENT_ORIGIN` | yes | `https://hasa-xtg1.vercel.app` — exact, no trailing slash |
| `TEACHER_SIGNUP_CODE` | for teacher signup | 6–80 characters; blank = disabled |
| `TRUST_PROXY` | yes behind Render | `1` so `req.ip` and cookies are right |
| `DATABASE_PATH` | only for `local` | absolute path on a volume; ignored when Turso is set |
| `GEMINI_API_KEY` / `OPENAI_API_KEY` | optional | blank = AI honestly reports “not configured” |

Boot fails fast, with the reason printed, if `SESSION_SECRET` is short, if
`TEACHER_SIGNUP_CODE` is set but shorter than 6 characters, or if production runs with
neither `TURSO_DATABASE_URL` nor an explicit `DATABASE_DRIVER=local`.

**Render Free sleeps** after ~15 minutes idle; the first request afterwards takes
~30–60 s. The client already shows its Tagalog loading state; nothing needs changing.

### 2.4 Cross-site cookies (Vercel ↔ Render)

The API sends `HttpOnly; Secure; SameSite=None` when `CLIENT_ORIGIN` is set in
production, and echoes only that origin in CORS with
`Access-Control-Allow-Credentials: true`. That is enough for Chrome, Edge, Firefox and
normal Safari. If you need first-party cookies for strict privacy modes, add the Vercel
`/api` rewrite described in `docs/VERCEL-API-PROXY.md`.

### 2.5 Verification commands

```bash
# Same code path as Turso, no cloud credentials needed (local libsql file)
npm test              --prefix server      # node:sqlite driver
npm run test:turso    --prefix server      # @libsql/client driver

# Against a running API (use a test database — it creates records)
HASA_API=https://hasa-api.onrender.com HASA_TEACHER_CODE=… \
  npm run smoke --prefix server
```

`server/scripts/migrate-to-turso.mjs` is the migration; `server/scripts/smoke.mjs` is
the 27-check end-to-end walkthrough. There is no `seed:reset` in production — it is a
local-only script and prints a warning.

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
`/teacher/progreso`, `/teacher/mga-ulat`, `/mga-aralin`, `/assets/*.js|css`, `/fonts/*.woff2`, `/favicon.svg`,
`/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/og-image.png` all return 200 with the right
content type.

Automated tests: `cd server && npm test` → 32/32; `cd client && npm test` → 52/52
(12 format, 8 SEO, 6 guard, 26 end-to-end page renders).

Against a running API, `HASA_API=<origin> HASA_TEACHER_CODE=<code> npm run smoke --prefix server`
runs 27 full-stack checks (registration, drafts, publish, XP once, quiz, progress, reset).
Use a test database — it creates records.

The end-to-end file (`client/src/test/e2e.test.jsx`) opens every student and teacher
page against a running API and fails on any `console.error`. Point it at a server with
`HASA_E2E_API=http://127.0.0.1:3100` (and `HASA_E2E_SIGNUP_CODE`); it skips itself when
nothing is listening.

### Turso path, exercised end to end without the cloud

| Check | Result |
|---|---|
| `npm test --prefix server` (node:sqlite driver) | 32/32 |
| `npm run test:turso --prefix server` (@libsql/client driver) | 32/32 |
| Schema + seed applied through the Turso driver on an empty database | ✔ 24 statements, 6 lessons, 3 quizzes, 4 activities |
| Migration of a seeded local database → Turso driver | 82 rows copied, all 14 tables + 3 relation checks matched |
| API restarted on the migrated database | teacher login 200; `/api/teacher/progress` → XP 162, 1/7 lessons, 14 % |
| Second restart, new browser session, student login with a reset password | XP still 162, level 1, 14 % bar |
| Re-completing the same lesson after migration | `xpAwarded: 0`, points unchanged (no duplicate XP) |
| `npm run migrate:dry-run` on the same data | reads only, no writes |

The Turso path was verified with `@libsql/client` pointed at a `file:` database, which
uses the same driver code as `libsql://` — the network hop is the only untested part.

**Not verified:** the live Vercel/Render URLs and real browser interaction — this sandbox
cannot reach `vercel.com`, has no Turso credentials, and no headless browser can be
installed here. After deploying, check: `/` loads, a hard refresh on `/student/dashboard`
returns the app (not 404), fonts render as Inter, the favicon appears, logging in sets a
`hasa_session` cookie, and `/api/health` answers from Render.

---

## 7. Cutover runbook — switching production to `production-redesign`

The Vercel project (`proctoristab/hasa-xtg1`, `https://hasa-xtg1.vercel.app`) still has
**Production Branch = `main`**, which is the old Stage-1 prototype. The redesign lives on
`production-redesign`. `main` is intentionally left untouched — do not point the project at
it, and do not merge the redesign into it.

Do these steps **in this order**. Steps 1–2 must come first: the Vercel build only bakes in
the `VITE_*` values that exist when the build runs, and without a reachable API every screen
that needs data shows the Tagalog "cannot connect" state.

### Step 1 — Turso + Render (the only real blocker)

Free stack, in order:

1. **Turso** — `turso db create hasa`, then `turso db show hasa --url` and
   `turso db tokens create hasa`.
2. **Migrate** existing student data (backup + verify):
   `npm run migrate:to-turso --prefix server` with `TURSO_DATABASE_URL` /
   `TURSO_AUTH_TOKEN` / `DATABASE_PATH` set. It refuses to finish if any table or
   relation does not match.
3. **Render** — New → Blueprint → this repo (`render.yaml`), then set
   `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `CLIENT_ORIGIN=https://hasa-xtg1.vercel.app`,
   `TEACHER_SIGNUP_CODE` (6–80 chars). `SESSION_SECRET` and `TRUST_PROXY=1` come from the
   blueprint. Wait for the deploy, then check `https://<service>.onrender.com/api/health`.

Render Free sleeps after ~15 minutes idle; the first request after that takes ~30–60 s.

### Step 2 — Vercel environment variables

Project → Settings → Environment Variables → **Production** (repeat for Preview):

| Name | Value |
|---|---|
| `VITE_API_URL` | the API origin from step 1, e.g. `https://hasa-api.onrender.com` — no trailing slash, no `/api` |
| `VITE_SITE_URL` | `https://hasa-xtg1.vercel.app` (or the custom domain) |

### Step 3 — switch the production branch

Project → Settings → **Git** → *Production Branch* → change `main` to
`production-redesign` → Save. Nothing deploys from this alone; step 4 does.

### Step 4 — deploy

Deployments → the latest `production-redesign` deployment → **Redeploy** (keep the build
settings; they come from `vercel.json`, so no dashboard override is needed):

| Setting | Value | Source |
|---|---|---|
| Install Command | `npm ci --prefix client` | `/vercel.json` |
| Build Command | `npm run build --prefix client` | `/vercel.json` |
| Output Directory | `client/dist` | `/vercel.json` |

If the project's Root Directory is set to `client` instead, `client/vercel.json` supplies
`npm ci` / `npm run build` / `dist`.

### Step 5 — optional custom domain

Add the domain in Vercel, then update `VITE_SITE_URL`, `client/public/sitemap.xml`,
`client/public/robots.txt`, and the canonical/OG URLs in `client/index.html`, and redeploy.

### Step 6 — verify on the live URL

- `/` renders the redesign, not the Stage-1 prototype.
- Hard-refresh `/student/dashboard` and `/teacher/progreso`, `/teacher/mga-ulat` → app loads (SPA rewrite), not 404.
- Register a teacher with `TEACHER_SIGNUP_CODE` → get a `HASA-XXXXXX` class code.
- Register a student with that code → the six lessons appear.
- Complete a lesson → XP increases and no fake success message appears.
- Reload after ~30 minutes → still signed in (session cookie is 14 days).
- DevTools console: no errors; Network: `/api/*` calls go to the API host, not Vercel.

### Rollback

Set Production Branch back to `main` and redeploy. Both branches stay intact, so the switch
is reversible in one setting.
