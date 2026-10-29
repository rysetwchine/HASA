# HASA — Development Plan

Companion to `REQUIREMENTS.md`. That file says *what* must be true; this one says *how*
we intend to build it.

## 1. Stack and rationale

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Most documented UI library; instant reload; simple build |
| Styling | Tailwind CSS | Consistent design tokens; easy accessible contrast |
| Routing | React Router | Standard client routing |
| Backend | Node.js + Express | One language across the project; abundant beginner material |
| Database | SQLite (`better-sqlite3`) | No server to run, no cost, one file |
| Auth | `express-session` + SQLite store + `argon2` | Server-side revocation; `httpOnly` cookie; no token handling in JS |
| AI | Provider adapter (Gemini, OpenAI) | Swappable, testable, keeps keys server-side |
| Testing | Vitest + Supertest | Fast unit + HTTP-level tests |

Runtime already available on the development machine: Node v24, npm 11, git 2.53.

**Not chosen:** Next.js (mixes client/server concepts too early for a beginner),
Supabase/Firebase (hides persistence and security mechanics; adds a vendor).
Both remain reasonable future migrations.

## 2. Architecture

```
Browser (React SPA, Tagalog UI)
   │  HTTPS + httpOnly session cookie
   ▼
Express API
   ├─ auth middleware        → who is calling? student or teacher?
   ├─ authorization          → may they touch THIS record?
   ├─ validation             → reject malformed input early
   ├─ routes → services      → business rules live here
   ├─ repositories           → all SQL lives here
   ▼
SQLite
   ▲
   └─ services/ai → Gemini / OpenAI   (server only; key from .env)
```

Rules that keep this honest:

- The browser never holds an API key and never decides a score or a badge.
- Routes handle HTTP only; services hold rules; repositories hold SQL. Each is testable alone.
- Every teacher endpoint verifies the student belongs to that teacher's class — not merely
  that the caller has the teacher role.
- Errors return one consistent shape: `{ error: { code, message } }`, with `message` already
  in Tagalog.

## 3. Folder structure

```
HASA/
├─ AGENTS.md
├─ README.md
├─ .gitignore
├─ .env.example
├─ docs/
│  ├─ REQUIREMENTS.md
│  ├─ PLAN.md
│  ├─ DATA-MODEL.md
│  ├─ API.md
│  ├─ AI-SETUP.md
│  └─ TAGALOG-GLOSSARY.md
├─ client/                     # public
│  └─ src/
│     ├─ app/                  # App.jsx, router.jsx
│     ├─ assets/images/        # brand, layout, auth, dashboard, lessons, practice, rewards
│     ├─ components/           # layout, ui, learning, lessons, gamification, dashboard
│     ├─ config/               # navigation.js
│     ├─ data/                 # demoData.js
│     ├─ pages/                # auth/, student/, teacher/, NotFoundPage.jsx
│     ├─ services/             # api.js (fetch wrapper)
│     ├─ styles/               # fonts.css, index.css
│     ├─ utils/                # cx.js, readingLevels.js
│     └─ test/                 # setup.js, smoke.test.jsx
├─ server/                     # private
│  └─ src/
│     ├─ config/env.js         # validates env at startup
│     ├─ routes/
│     ├─ middleware/           # requireAuth, requireRole, rateLimit, validate, errorHandler
│     ├─ services/
│     │  ├─ ai/                # provider.js, gemini.js, openai.js,
│     │  │                     #   promptBuilder.js, safety.js, cache.js
│     │  ├─ extraction/        # pdf.js, docx.js, validateFile.js
│     │  └─ gamification/      # points.js, badges.js, quests.js
│     ├─ db/                   # migrations/, seed/, repositories/
│     └─ utils/
└─ graphify-out/               # generated later by `/graphify .`
```

## 4. Data

Full schema in `docs/DATA-MODEL.md`. Three principles:

1. **Points are an append-only ledger**, never a mutable counter.
2. **Rewards are computed server-side** from rules, so the client cannot grant itself anything.
3. **A teacher sees only their own class**, enforced in the query, not the UI.

## 5. AI integration

Details in `docs/AI-SETUP.md`. Summary:

- One adapter interface: `simplify({ text, level, provider })` and
  `explainWords({ text, words, provider })`, plus question generation.
- Provider chosen from config, overridable per request; the response records which
  provider and model actually produced it.
- Keys in `server/.env` only. Missing key ⇒ explicit "hindi naka-configure" error.
- Caching keyed on a hash of `text + level + provider + model + promptVersion`.
- Per-student daily quota, input cap, output cap, timeout, backoff on rate limits.
- Prompt version is stored with every result so outputs remain explainable later.

## 6. Language approach

- No i18n library. All UI copy is authored in Tagalog; `docs/TAGALOG-GLOSSARY.md` keeps
  terminology consistent.
- Prompts instruct the model to answer **in Tagalog**, preserving academic terms
  (showing the original term in parentheses when it aids understanding).
- Source text in English is simplified *and explained* in Tagalog — a translation alone is
  not sufficient and does not satisfy the requirement.

## 7. Reading levels

- Stored as canonical keys: `independent`, `instructional`, `frustration`.
- Displayed as *Malayang Pagbasa (Independent)*, *May Gabay na Pagbasa (Instructional)*,
  *Nahihirapang Pagbasa (Frustration)*.
- **Chosen by the student or assigned by the teacher — never detected.** No UI text may
  imply HASA measured reading ability.

## 8. File upload

- Accept `.pdf`, `.doc`, `.docx`; validate extension **and** file signature (magic bytes).
- Enforce `UPLOAD_MAX_BYTES`; reject on mismatch with a Tagalog error.
- **Extract text, then discard the file.** No student documents are stored.
- If a PDF yields little or no text, report that it appears to be scanned and that OCR is
  not supported yet. Do not silently return an empty simplification.

## 9. Stages

| # | Stage | Deliverable | Gate |
|---|---|---|---|
| 0 | Setup | Docs, `.gitignore`, `.env.example`, folder skeleton | ✅ done |
| 1 | UI shell | Tagalog static pages, navigation, no backend | Review UI before any AI spend |
| 2 | DB + auth | Migrations, register/login/logout, roles, class codes | Session + role tests pass |
| 3 | Simplifier with fake adapter | End-to-end flow, zero API cost, clearly labelled as not-real | Flow proven |
| 4 | Real providers | Gemini, then OpenAI; cache, quota, error states | Manual smoke test with real keys |
| 5 | Comprehension | MCQ generation, scoring, feedback | Deterministic scoring tests |
| 6 | Gamification | Ledger, badges, quests | Cannot double-award |
| 7 | Progress + teacher tools | Student dashboard, teacher monitoring, assignment | Authorization tests |
| 8 | Hardening | Mobile, accessibility, rate limits, error states | Checklist signed off |
| 9 | Deploy + docs | Hosting, secrets, AI setup verified | Live demo |

Order rationale: build and review the interface before spending money; prove the pipeline
with a fake adapter before debugging providers; award points only once there is real work
to reward.

`/graphify .` runs after Stage 1 produces source code — not before.

## 10. Risks

| Risk | Mitigation |
|---|---|
| AI output drifts out of Tagalog | Prompt constraint + spot-check fixtures in tests |
| Tagalog simplification loses academic accuracy | Preserve terms in parentheses; teacher review loop |
| Scanned PDFs silently fail | Detect low text yield; explicit message |
| Cost overrun | Cache, input/output caps, per-student quota, no retries on quota errors |
| Teacher sees the wrong students | Authorization enforced in SQL; tests per endpoint |
| Reading-level claim overstated | Levels are chosen; wording reviewed against Requirement 4 |
| Minor students' data exposed | Minimal fields, class code instead of rosters, no real data in dev |

## 11. Non-goals (MVP)

- Automatic reading-ability assessment
- OCR for scanned documents
- Open-ended/AI-graded answers
- Multi-language UI
- Native mobile app
- Real-time collaboration
