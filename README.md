# HASA

**Harnessing AI Simplifier for Achievement** — a supplementary web-based instructional
tool for Grade 8 Araling Panlipunan.

HASA serves each lesson in **three authored reading-level variants**, grades activities and
quizzes **on the server**, records real progress in SQLite, and gives teachers their own
class-scoped workspace. The interface and all learning content are in Filipino.

> **Status: production build with a working API.** The client is a static SPA on Vercel;
> the API is a separate Node process that owns the SQLite file. See
> `docs/DEPLOYMENT.md` for what that means for hosting, and §"What still needs external
> setup" below for the parts that require your accounts.

## Language policy

- **The interface and learning content are Filipino only.** That includes navigation,
  instructions, lesson text, questions, feedback, validation messages, and errors.
- Technical terms stay as they are: XP, badge, username, password, AI.
- Reading levels keep their approved names — *Malayang Pagbasa*, *May Gabay na Pagbasa*,
  *Nahihirapang Pagbasa* — with the English term in parentheses where it helps.
- Developer documentation (this file and `docs/`) is in English so it stays maintainable.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 19 + Vite 8 | Route-level lazy loading, no source maps in production |
| Styling | Tailwind 4 | HASA plum/cream/violet/gold tokens, Inter only |
| Routing | React Router 8 | `BrowserRouter`; SPA rewrites on the host |
| API | Express 5 on Node ≥ 22.9 | ES modules |
| Database | `node:sqlite` (`DatabaseSync`) | No native dependency to compile |
| Auth | Server sessions, scrypt passwords | httpOnly cookie, HMAC-peppered token hash |
| AI | Gemini / OpenAI, server-side only | Optional; reports "not configured" honestly |
| Tests | `node --test` (server), Vitest (client) | 24 API tests, 26 client tests |

## Repository layout

```
HASA/
├─ vercel.json            # SPA rewrites + cache/security headers (root project)
├─ client/
│  ├─ vercel.json         # same, if the Vercel Root Directory is client/
│  ├─ index.html          # lang="tl", canonical, OG/Twitter, JSON-LD
│  ├─ public/             # favicon, OG image, robots.txt, sitemap.xml, llms.txt
│  └─ src/
│     ├─ app/             # router, AuthProvider
│     ├─ components/      # ui.jsx primitives, layouts, Seo, student/teacher widgets
│     ├─ lib/             # api client, useApi, format
│     └─ pages/           # public, auth, student, teacher
├─ server/
│  ├─ src/
│  │  ├─ app.js           # express app, routes, error handling
│  │  ├─ db/              # schema + idempotent seed content
│  │  ├─ middleware/      # auth, security (CORS/origin, rate limit), errors
│  │  ├─ routes/          # auth, student, teacher
│  │  ├─ services/        # auth, content, progress, AI
│  │  └─ utils/           # security, validation, time, errors
│  └─ test/api.test.js    # integration tests on an in-memory database
└─ docs/                  # requirements, plan, API, data model, AI, glossary, deployment
```

## Local development

Node 22.9+ is required (the API uses the built-in `node:sqlite`). Two terminals:

```bash
# 1. API — http://localhost:3000
cd server
cp .env.example .env          # fill SESSION_SECRET and TEACHER_SIGNUP_CODE
npm install
npm run dev

# 2. Client — http://localhost:5173 (proxies /api to the API above)
cd client
npm install
npm run dev
```

First run creates `server/data/hasa.sqlite` and seeds the curriculum. There are **no seeded
accounts** — register a teacher with the `TEACHER_SIGNUP_CODE` you set, then register
students with the class code the API generates.

Useful commands:

```bash
cd server && npm test        # 24 integration tests, in-memory DB
cd server && npm run check   # node --check on the entry point
cd client && npm test        # 26 Vitest tests
cd client && npm run build   # production build into client/dist
```

## Routes

Public:

| Path | Page |
|---|---|
| `/` | Landing (pampublikong paglalarawan) |
| `/login` | Mag-log in (noindex) |
| `/register` | Gumawa ng account (noindex) |
| `*` | Custom na 404 |

Student (session + `role=student`; all `noindex`):

| Path | Page |
|---|---|
| `/student/dashboard` | Pangunahing Pahina |
| `/student/aralin` | Mga Aralin |
| `/student/aralin/:id` | Detalye ng Aralin |
| `/student/aktibidad` · `/student/aktibidad/:id` | Aktibidad at player |
| `/student/pagsusulit` · `/student/pagsusulit/:id` | Pagsusulit at player |
| `/student/progreso` | Progreso |
| `/student/mga-gantimpala` | Mga Gantimpala |
| `/student/pasimplehin` | AI Pantulong |
| `/student/profile` | Aking Profile |

Teacher (session + `role=teacher`; all `noindex`):

| Path | Page |
|---|---|
| `/teacher/dashboard` | Pangunahing Pahina |
| `/teacher/mga-mag-aaral` · `/:id` | Mga Mag-aaral at detalye |
| `/teacher/mga-aralin` | Pamamahala ng mga Aralin |
| `/teacher/mga-aktibidad` | Mga Aktibidad |
| `/teacher/mga-pagsusulit` | Mga Pagsusulit |
| `/teacher/mga-ulat` | Mga Ulat |
| `/teacher/profile` | Aking Profile |

Legacy paths (`/mga-aralin`, `/aktibidad`, `/pagsasanay`, `/pagsusulit`, `/pag-unlad`,
`/mga-nakamit`, `/mga-gantimpala`, `/pasimplehin`, `/guro`) redirect to their new homes so
old links keep working.

## Security model

- **Passwords**: scrypt (N=16384, r=8, p=1) with a per-user salt; `timingSafeEqual` compare.
- **Sessions**: random 32-byte token in an httpOnly cookie; only an HMAC-SHA256 of the
  token (keyed by `SESSION_SECRET`) is stored, so a database leak cannot be replayed as a
  session. `SameSite=Lax`, or `None; Secure` when the API and client are on different
  origins in production.
- **Authorization**: every `/api/student/*` and `/api/teacher/*` route is behind
  `requireAuth` + `requireRole`. Teacher queries are scoped by `classes.teacher_id`; a
  teacher asking for another class's student gets **404**, not 403, so ids are not
  enumerable.
- **Request hygiene**: JSON body limit, `Origin` verification on state-changing requests,
  in-memory rate limits on login/register/submit, `x-powered-by` disabled.
- **No secrets in the bundle**: the client only ever talks to `/api`; provider keys stay in
  the server's environment.

## Reading levels: chosen, never diagnosed

The three variants are authored curriculum. A student picks their level, or a teacher
assigns it. HASA does not measure, estimate, or infer reading ability anywhere in the UI,
the API, or the AI prompt, and no copy may imply otherwise.

## AI simplification

Optional and provider-backed. With no key configured, `GET /api/config` reports
`ai.enabled: false` and the UI says plainly that the AI assistant is not configured — it
never fabricates output. See `docs/AI-SETUP.md`.

## What still needs external setup

1. **A persistent host for the API.** Vercel only runs the static client; SQLite needs a
   disk that survives deploys (Render/Railway/Fly with a volume, or a VPS). Vercel
   serverless functions cannot host it. Details and a checklist: `docs/DEPLOYMENT.md`.
2. **`VITE_API_URL`** on Vercel must point at that API's origin, and the API's
   `CLIENT_ORIGIN` must list the Vercel domain (`SameSite=None; Secure` cookies).
3. **`TEACHER_SIGNUP_CODE`** in the API environment, otherwise teacher self-registration is
   disabled by design.
4. **AI provider key** (optional) in the API environment.
5. **Custom domain** (optional): set `VITE_SITE_URL` and update `sitemap.xml` / `robots.txt`
   / the canonical in `client/index.html` to the new origin.
6. **Content review.** The seeded curriculum is written and structurally sound, but it has
   not been reviewed by an Araling Panlipunan teacher for classroom use.

## Documentation

| Document | Purpose |
|---|---|
| `docs/REQUIREMENTS.md` | Approved requirements |
| `docs/PLAN.md` | Stack, architecture, stages, decisions, risks |
| `docs/DATA-MODEL.md` | Tables and why they exist |
| `docs/API.md` | HTTP endpoints |
| `docs/AI-SETUP.md` | Configuring and testing Gemini / OpenAI |
| `docs/TAGALOG-GLOSSARY.md` | Agreed Tagalog UI terms |
| `docs/DEPLOYMENT.md` | Vercel SPA + persistent API host, env vars, custom domain, HTTPS |
