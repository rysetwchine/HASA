# Connecting HASA to your Turso database

Your database: **`hasa`** on Turso Cloud (AWS `ap-southeast-1`, Singapore).

```
TURSO_DATABASE_URL = libsql://hasa-chinee.aws-ap-southeast-1.turso.io
```

The URL is not secret. **The token is** — it never goes into `client/`, never into Git,
and never into a chat message. Everything below is server-side only.

---

## 1. Where the token goes

### Option A — local development (`server/.env`)

`server/.env` already exists, is **git-ignored** (`git check-ignore` confirms), and already
contains the URL. You only fill in one blank line:

```bash
# /home/user/HASA/server/.env   (open it in your editor)
TURSO_DATABASE_URL=libsql://hasa-chinee.aws-ap-southeast-1.turso.io
TURSO_AUTH_TOKEN=                                   ← paste here, no quotes, no spaces
```

Get the token from **Turso dashboard → Database `hasa` → Connect → Create token**, or:

```bash
turso db tokens create hasa
```

Keep the whole value; a Turso token is a JWT (`eyJhbGciOi…`) and can be long.

### Option B — Render (production API)

Render dashboard → your service → **Environment** → `TURSO_AUTH_TOKEN` → paste → Save.
If you deploy through `render.yaml`, the variable already exists as a `sync: false` secret,
so Render asks for the value and stores it encrypted; it is never in the repo.

### Option C — a one-off shell session

```bash
cd server
export TURSO_DATABASE_URL="libsql://hasa-chinee.aws-ap-southeast-1.turso.io"
read -rs TURSO_AUTH_TOKEN && export TURSO_AUTH_TOKEN   # paste, press Enter, stays hidden
```

`read -rs` keeps the token out of your shell history.

> Never put `TURSO_AUTH_TOKEN` in `client/.env*`, in a `VITE_*` variable, or in any file
> you commit. Vite only inlines `VITE_*` values into the browser bundle, and the server
> never sends the token to the client — `grep -r TURSO_AUTH client/` returns nothing.

---

## 2. Test the live connection

Run these in `server/` (they read `server/.env` automatically).

```bash
cd server
npm run db:check
```

Read-only. It connects with the **same driver the API uses**, then reports:

```
HASA database check
  driver : turso
  target : turso (hasa-chinee.aws-ap-southeast-1.turso.io)
  token  : set (hidden)

  connected in 214 ms

Schema
  ✔ all 14 tables present

Rows
  users                 0
  …
Seeded content
  ✔ curriculum and badges present

Relationships
  ✔ students without a class: 0
  …
RESULT: OK — the API will use this database unchanged.
```

Exit codes: `0` healthy, `1` schema/data problem, `2` could not connect (it prints whether
the token is missing, wrong, or the machine is offline).

### If the database is brand new

A fresh database answers `1` with `missing: classes, users, …`. Create the schema and seed
the platform content — **idempotent, never touches student rows**:

```bash
npm run db:init        # CREATE TABLE IF NOT EXISTS + upsert seeds (lessons, quizzes, badges)
npm run db:check       # should now be green
```

### Copy your existing records across (optional)

Only if you have real students/teachers in a local file. It backs up first, is idempotent,
and verifies every table count:

```bash
cd server
npm run migrate:dry-run     # counts only, writes nothing
npm run migrate:to-turso    # backup → copy → verify
npm run migrate:verify      # re-check at any time
```

Then look at Render's `/api/health` and log in on the deployed site.

### Prove it end to end without touching your real data

```bash
cd server
npm run test:turso    # 32 tests through @libsql/client on a throwaway file
npm run dev           # boots the API against Turso (uses server/.env)
# in another terminal:
HASA_API=http://127.0.0.1:3000 HASA_TEACHER_CODE=<your code> npm run smoke
```

`smoke` registers a throwaway teacher+student, completes a lesson, earns XP once, submits a
quiz and checks progress — 27 assertions. It creates records, so run it against a test
database (a second Turso DB) if you don't want it in `hasa`.

### "Is my data really in Turso?"

```bash
turso db shell hasa "SELECT COUNT(*) FROM users;"
turso db shell hasa "SELECT student_id, SUM(delta) FROM points_ledger GROUP BY 1;"
```

If those rows appear, the API is writing to Turso — there is no local file involved when
`TURSO_DATABASE_URL` is set.

---

## 3. What the server does with those two variables

`server/src/config.js` reads them; `server/src/db/database.js` picks the driver:

| `TURSO_DATABASE_URL` | Driver | Storage |
|---|---|---|
| set (`libsql://…`) | `@libsql/client` | Turso Cloud |
| empty | `node:sqlite` | local file (`DATABASE_PATH`) |

Everything the app persists lives in that one database — teacher and student accounts,
scrypt password hashes, server-side sessions, lessons, quizzes, attempts and answers,
lesson progress, the XP ledger, and badges.

- Writes that must not half-happen (quiz submit + XP + badge) run in one transaction
  (`client.transaction("write")` on Turso).
- Duplicate XP is impossible: the XP ledger has a unique index on
  `(student_id, reason_code, ref_type, ref_id)` and inserts use `INSERT OR IGNORE`.
- In production the server **refuses to boot** without Turso (unless you explicitly set
  `DATABASE_DRIVER=local` on a host with a real disk), so a wiped Render filesystem can
  never silently become the database of record.

## 4. Deployment checklist (Render Free + Vercel)

Render (Blueprint `render.yaml`, root directory `server`):

| Variable | Value |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://hasa-chinee.aws-ap-southeast-1.turso.io` |
| `TURSO_AUTH_TOKEN` | your token (secret, Render-encrypted) |
| `SESSION_SECRET` | auto-generated by the blueprint (≥ 32 chars) |
| `CLIENT_ORIGIN` | `https://hasa-xtg1.vercel.app` (exact, no trailing slash) |
| `TEACHER_SIGNUP_CODE` | 6–80 chars, needed to self-register teachers |
| `TRUST_PROXY` | `1` (already in the blueprint) |
| `NODE_ENV` | `production` (already in the blueprint) |

Render injects `PORT` itself; the server reads it. Health check: `/api/health`.
Free instances sleep after ~15 min idle → the first request takes ~30–60 s.

Vercel (frontend stays here): set `VITE_API_URL` to the Render URL
(`https://<service>.onrender.com`, no `/api` at the end) and `VITE_SITE_URL` to your site;
then redeploy so the values are baked into the bundle. If browsers block cross-site
cookies, add the `/api` rewrite from `docs/VERCEL-API-PROXY.md`.

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `RESULT: CONNECTION FAILED — fetch failed` + "token is empty" | `TURSO_AUTH_TOKEN` blank | paste it into `server/.env` |
| same, with a token set | wrong/expired token, or no network | `turso db tokens create hasa`, retry |
| `✘ missing: classes, users, …` | fresh database | `npm run db:init` |
| `✘ platform content missing` | seeds not run | `npm run db:init` |
| API exits at boot, `TURSO_DATABASE_URL is required in production` | prod without Turso | set the variable, or `DATABASE_DRIVER=local` on a volume host |
| login works locally but not on Render | `CLIENT_ORIGIN` mismatch or `VITE_API_URL` unset | fix both, redeploy |
| data gone after Redeploy | API was on `DATABASE_DRIVER=local` | remove that override so Turso is used |
