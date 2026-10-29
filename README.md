# HASA

**Harnessing AI Simplifier for Achievement**

HASA is a supplementary web-based instructional tool for Grade 8 students. It simplifies
DepEd Self-Learning Module (SLM) materials according to a student's chosen reading level,
and uses gamification (points, badges, quests) to keep students engaged.

> **Status: Stage 1 complete — static Tagalog UI shell.**
> The frontend renders all planned routes with clearly-labelled demonstration data.
> There is still no backend, authentication, database, or AI integration.

## Language policy

The **application interface is Tagalog only** — navigation, instructions, simplified
materials, questions, feedback, and error messages. Developer-facing documentation
(like this file) is in English so that it stays maintainable; that is not part of the
student-facing product.

Reading levels keep their approved English names, shown with a Tagalog rendering, e.g.
*Malayang Pagbasa (Independent)*. See `docs/TAGALOG-GLOSSARY.md`.

## Technology stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | Node.js + Express |
| Database | SQLite |
| Auth | Server-side sessions + password hashing |
| AI | Google Gemini and OpenAI (server-side only) |
| Testing | Vitest + Supertest |

## Repository layout

```
HASA/
├─ AGENTS.md              # agent/contributor instructions
├─ README.md              # this file
├─ .env.example           # required environment variable names (no real values)
├─ docs/                  # requirements, plan, data model, API, AI setup, glossary
├─ client/                # React frontend (populated in Stage 1)
└─ server/                # Express backend (populated in Stage 2)
```

## Documentation index

| Document | Purpose |
|---|---|
| `docs/REQUIREMENTS.md` | The approved requirements, verbatim in intent |
| `docs/PLAN.md` | Stack, architecture, stages, decisions, risks |
| `docs/DATA-MODEL.md` | Database tables and why they exist |
| `docs/API.md` | Planned HTTP endpoints |
| `docs/AI-SETUP.md` | Configuring and testing Gemini / OpenAI |
| `docs/TAGALOG-GLOSSARY.md` | Agreed Tagalog UI terms |

## Ground rules

- **No secrets in the frontend.** API keys live only in `server/.env`, which is git-ignored.
- **No fabricated AI output.** If a provider is missing or fails, the UI says so plainly.
- **No real student data during development.** Use fictional seed accounts.
- **Do not claim HASA assesses reading ability.** Levels are chosen, not diagnosed.
- **Install nothing without approval.** Each stage is presented before it is built.

## Getting started

The frontend lives in `client/`. Node 24.15+ is required.

```bash
cd client
npm install      # only needed on a fresh clone
npm run dev      # http://localhost:5173
npm run build    # production build into client/dist
npm test         # Vitest + Testing Library
```

Nothing in Stage 1 calls the network. All screens use demonstration data from
`client/src/features/demo/demoData.js`, and every screen that could be mistaken
for real AI output carries an explicit Tagalog disclaimer.

### Stage 1 routes

| Path | Page |
|---|---|
| `/` | Simula |
| `/login` | Mag-log in |
| `/register` | Magrehistro |
| `/pasimplehin` | Pasimplehin |
| `/aktibidad` | Aktibidad |
| `/misyon` | Misyon |
| `/mga-nakamit` | Mga Nakamit |
| `/pag-unlad` | Pag-unlad |
| `/guro` | Guro |

The reading levels live in exactly one place:
`client/src/lib/readingLevels.js`.

**Pending:** `docs/TAGALOG-GLOSSARY.md` is still a proposal and needs review by a
Filipino or Reading teacher before the interface is used with real students.
