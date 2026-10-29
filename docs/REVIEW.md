# HASA — Code Review and Improvement Log

**Date:** 2026-10-29
**Scope:** `client/` (React + Vite + Tailwind v4). No backend exists yet, so nothing in
`server/` was touched.
**Method:** full read of every file under `client/src` (pages, components, data, styles,
services, tests), comparison against the exported Figma frames in `.design/figma/`
(`dashboard`, `lessons`, `practice`, `rewards`, `login`), `npm run build`, `npm test`, and a
running dev server checked against the preview host.

Nothing was deleted. All existing behaviour, routes, copy, assets, and demo data were kept.

---

## 1. What is already healthy

- **Architecture is coherent.** `app/` (shell + router + progress context), `components/`
  grouped by domain, `config/navigation.js` as the single navigation source,
  `data/` for demo content, `services/` for persistence, `utils/` for tokens. Keep this shape.
- **Honesty rules are enforced in the UI.** Every screen that could be mistaken for real AI
  output or real student data carries a `DemoNotice`/`Alert`. `api.js` deliberately throws so
  the frontend cannot silently start calling an unbuilt API.
- **The prototype logic is real, not mocked.** Points are recalculated from an append-only
  history (`progressStore.js`), retries cannot re-award XP, streaks use local date keys, badges
  unlock from criteria, and everything is sanitised when read back from `localStorage`.
- **Accessibility basics are present.** Skip link, focus-visible rings, `role="progressbar"`
  with values, labelled form fields, modal with Escape/backdrop close and focus trap, reduced
  motion classes in several places.
- **Tests exist and are meaningful.** 51 tests covered all routes, reading-level selection,
  the activity flow (XP once, no XP on fail, timer) and the progress store.

---

## 2. Issues found

Severity: **P1** = visibly broken/blocking, **P2** = correctness or accessibility,
**P3** = polish. "Fixed" means fixed in this branch.

| # | Sev | Issue | Where | Status |
|---|-----|-------|-------|--------|
| 1 | P1 | Dev server rejects the hosted preview origin (HTTP 403 "Blocked request"), so the app cannot be opened outside `localhost`. | `client/vite.config.js` | **Fixed** — `server.allowedHosts` for the preview domain, `strictPort`, `host: true`. |
| 2 | P1 | `shadow-lifted` is used by the Modal, the notification popover and two hover cards but is **not defined** in `@theme`, so those surfaces render with no elevation at all. | `styles/index.css`, `ui/Modal.jsx`, `dashboard/NotificationBell.jsx`, `dashboard/SummaryCard.jsx`, `lessons/LessonCard.jsx` | **Fixed** — added the `--shadow-lifted` token. |
| 3 | P1 | The brand underline in the sidebar is `ml-40` (160px) + `w-[180px]` = 340px inside a 284px content box at the `xl` width, which produces a horizontal scrollbar inside the sidebar. | `components/layout/Sidebar.jsx` | **Fixed** — right-aligned rule with `max-w` and `w-full`, fluid brand sizes. |
| 4 | P1 | The Lessons banner is pulled upward with `-mt-5/-mt-7`, which is *larger than the space below the Topbar*: the banner overlaps and paints over the bottom of the XP bar and the student block. | `pages/student/LessonsPage.jsx` | **Fixed** — kept the horizontal full-bleed, removed the vertical negative margins. |
| 5 | P1 | `/misyon` and `/guro` are only reachable from the **mobile** nav. On desktop there is no link to either page at all. | `components/layout/Sidebar.jsx`, `config/navigation.js` | **Fixed** — secondary "Iba pang pahina" section in the sidebar that reuses `EXTRA_NAV_ITEMS`. |
| 6 | P2 | `resetProgress()` exists in `ProgressProvider`/`progressStore` but no screen ever calls it: a user cannot clear their local XP, badges or history. | `pages/student/ProgressPage.jsx` | **Fixed** — "I-reset ang pag-unlad" + confirmation modal. |
| 7 | P2 | The Progress page reuses the Rewards icon **and** the Rewards kicker ("YOUR COLLECTION"), so two different pages look identical at the top. | `pages/student/ProgressPage.jsx` | **Fixed** — own kicker ("YOUR JOURNEY") and a `TrendingUp` icon; `PageHeader` now accepts an element as `icon`. |
| 8 | P2 | Password toggle always reads "Show", even while the password is visible. | `pages/auth/LoginPage.jsx`, `RegisterPage.jsx` | **Fixed** — "Show"/"Hide". |
| 9 | P2 | `aria-describedby` points at `login-username-hint` / `login-password-hint`, elements that never exist, so screen readers announce a dangling reference. | `pages/auth/LoginPage.jsx` | **Fixed** — reference only the error nodes. |
| 10 | P2 | The Student/Teacher tabs are declared as a tablist but cannot be operated with arrow keys (WAI-ARIA tabs pattern requires it), and the markup is duplicated between login and register. | `pages/auth/*` | **Fixed** — new shared `components/auth/RoleTabs.jsx` with Left/Right/Home/End. |
| 11 | P2 | User-visible typo: "Play featured **challange**". The smoke test asserted the typo, so the test was fixed too. | `data/demoData.js`, `test/smoke.test.jsx` | **Fixed** — "challenge". |
| 12 | P2 | Activity progress bar starts at **0%** on question 1 (`value={current}`), which reads as broken. | `components/practice/ActivityPlayer.jsx` | **Fixed** — counts answered questions. |
| 13 | P2 | The 404 icon is `bg-accent` (violet) with `text-brand-700` (violet) — near-invisible, and the small kicker fails contrast on the cream background. | `pages/NotFoundPage.jsx` | **Fixed** — white icon on the accent tile, `text-accent-deep` kicker. |
| 14 | P2 | The AI Simplifier step 04 shows a fixed sample but never says it ignores the level chosen in step 02; a student can reasonably read it as the level-specific output. | `pages/student/SimplifyPage.jsx` | **Fixed** — copy now states the sample does not change with the level. |
| 15 | P3 | On phones the Topbar wraps to a second row because the student name block competes with the XP widget. | `components/layout/Topbar.jsx` | **Fixed** — name hidden below `sm`, with an `sr-only` equivalent. |
| 16 | P3 | No favicon → 404 on every load; no `color-scheme` hint. | `client/index.html`, `client/public/favicon.png` | **Fixed** — added. |
| 17 | P3 | Reduced-motion preference ignored for the global smooth scrolling. | `styles/index.css` | **Fixed** — `prefers-reduced-motion` override. |
| 18 | P3 | Lessons search only matched titles, so typing a lesson number ("1.5") returned nothing. | `pages/student/LessonsPage.jsx` | **Fixed** — also matches the lesson label; card art is lazy-loaded. |
| 19 | P3 | `HomePage` renders "0/0 correct" for history rows without a `total`. | `pages/student/HomePage.jsx` | **Fixed** — falls back to the correct count. |
| 20 | P3 | Topbar level ring used an inline `boxShadow` instead of a token/class. | `components/layout/Topbar.jsx` | **Fixed**. |
| 21 | P3 | README's route table is stale (missing `/mga-aralin` and the two aliases, and still describes `/` as "Simula"). | `README.md` | **Fixed** — table updated. |

### Known issues intentionally left open

These need a product decision rather than a code fix; changing them unilaterally would
contradict either the Figma design or the project's own ground rules.

| # | Issue | Why it was not changed |
|---|-------|------------------------|
| A | **UI language is inconsistent with the stated policy.** `README.md` says the interface is Tagalog only, but the Figma-driven pages are English (Dashboard, Lessons, Practice, Rewards, Progress, login/register), while Misyon, Guro, form errors and the 404 page are Tagalog. | This is a content/i18n decision affecting the delivered design. Needs an approved Tagalog string list (see `docs/TAGALOG-GLOSSARY.md`, still a proposal). |
| B | **Lesson Start/Review/Continue are all `disabled`.** | There is no lesson body content anywhere in the repo, and inventing Araling Panlipunan lesson text would break the "no fabricated content" rule. The page states this plainly in an `Alert`. Best next step is a content decision, then a `/mga-aralin/:lessonId` route. |
| C | **The AI Simplifier "Pasimplehin" button is disabled** and step 04 is static. | Requires the Stage 2 backend and a configured provider (`docs/AI-SETUP.md`). The current copy is honest about it. |
| D | **Login / Register validate but never sign in.** | Same reason: no backend, no session, no hashing. The forms say so after submit. |
| E | **The bell says "0 anunsyo" while the dashboard lists two demo announcements.** | The empty state is asserted by an existing test (`Hindi nag-imbento ng anunsyo ang prototype`) and encodes a deliberate honesty decision. Aligning the two is a product call, not a bug fix. |
| F | **Practice cards are clickable as a whole but only the "Play now" button is keyboard reachable.** | The same action is available to keyboard users through the button; fixing it properly means restructuring the card into a single stretched control, which changes the DOM the tests assert. Low value, note for later. |
| G | **~15 unused components** (`dashboard/ContinueLearningCard`, `LevelCard`, `WeeklyActivityCard`, `DashboardAside`, `ui/LegacyPageHeader`, `gamification/PointsPill`, `lessons/LessonCard`, …) and unused demo exports (`demoLessons`, `demoQuests` partially, `demoWeeklyActivity`). | Explicitly not deleted without approval. They are either superseded by the Figma rebuild or planned for Stage 2. |
| H | **Main JS chunk is 503 kB (193 kB gzip)** — Vite warns. | Code-splitting the routes is a worthwhile follow-up but unrelated to the reported defects. |
| I | `getLevelProgress()` computes `level = floor(xp / 300)`, so a learner with 0–299 XP sees "Level 1 · 0 / 600 XP". | The formula is what reproduces the Figma numbers exactly (1,200 / 1,500 XP → Level 4). Not changed to avoid shifting the design. |

---

## 3. Files changed in this branch

**Modified**

- `client/vite.config.js` — preview `allowedHosts`, `host`, `strictPort`
- `client/index.html` — favicon + `color-scheme`
- `client/src/styles/index.css` — `--shadow-lifted`, reduced-motion support
- `client/src/components/layout/Sidebar.jsx` — overflow fix, secondary nav
- `client/src/components/layout/Topbar.jsx` — mobile layout, token shadow
- `client/src/components/ui/PageHeader.jsx` — accepts a React element for `icon`
- `client/src/pages/student/LessonsPage.jsx` — banner overlap, search, lazy images
- `client/src/pages/student/ProgressPage.jsx` — header identity, reset flow
- `client/src/pages/student/HomePage.jsx` — history detail guard
- `client/src/pages/student/SimplifyPage.jsx` — honest static-sample copy
- `client/src/pages/auth/LoginPage.jsx`, `RegisterPage.jsx` — shared tabs, Show/Hide, aria fixes
- `client/src/pages/NotFoundPage.jsx` — contrast
- `client/src/components/practice/ActivityPlayer.jsx` — progress semantics
- `client/src/data/demoData.js` — typo
- `client/src/test/smoke.test.jsx` — test follows the corrected copy
- `README.md` — route table

**Added**

- `client/src/components/auth/RoleTabs.jsx`
- `client/src/test/ui.test.jsx` (4 new tests)
- `client/public/favicon.png`
- `docs/REVIEW.md` (this file)

**Removed:** none.

---

## 4. Verification

```bash
cd client
npm run build   # ✓ built, only the pre-existing chunk-size warning
npm test        # ✓ 4 files, 55 tests passed (51 existing + 4 new)
```

Checks covered by the new tests: sidebar desktop links to `/misyon` and `/guro`; the reset
confirmation actually clears `hasa:progress:v1` and restores the empty states; Show/Hide
toggles the password input type; arrow keys move the Student/Teacher tab selection.

Manual check: the dev server (`npm run dev`) serves every route and accepts the hosted
preview origin; all routes render without console errors (`smoke.test.jsx`).

---

## 5. Recommended next steps

1. Decide the language policy (item A) and produce the final Tagalog string list — it will
   touch every Figma-derived page at once.
2. Decide the lesson-content source (item B), then add `/mga-aralin/:lessonId` using the
   existing `WorkspaceStep`/`FeedbackPanel` components and the existing progress store.
3. Route-level code splitting (`React.lazy`) to clear the 503 kB warning.
4. Prune or repurpose the unused components (item G) once Stage 2 is scoped.
5. Stage 2 backend: sessions, SQLite, gamification server-side, AI provider adapter.
