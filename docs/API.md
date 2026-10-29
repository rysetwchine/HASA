# HASA — API Plan

Planned endpoints. Nothing is implemented yet (Stage 0). Base path: `/api`.

## Conventions

- JSON in, JSON out. `Content-Type: application/json` except uploads (multipart).
- Auth via `httpOnly` session cookie. No tokens in `localStorage`.
- Every response either succeeds or returns:
  ```json
  { "error": { "code": "AI_NOT_CONFIGURED", "message": "Hindi naka-configure ang AI provider na ito." } }
  ```
- `message` is already in Tagalog and safe to show to a student. Internal details go to
  server logs only.
- Status codes: `400` validation, `401` not logged in, `403` wrong role or wrong class,
  `404` not found *or* not yours (do not leak existence), `409` conflict, `413` too large,
  `422` unusable content, `429` quota/rate limit, `502` provider failure.

## Auth

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/auth/register/student` | public | Username, password, display name, `join_code` |
| POST | `/auth/register/teacher` | public | Username, password, display name |
| POST | `/auth/login` | public | Session start |
| POST | `/auth/logout` | any | Destroys the session row |
| GET | `/auth/me` | any | Current user, role, class, reading level |

Registration is rate-limited. Password rules are validated server-side and explained in
Tagalog. Usernames are case-insensitive for lookup but stored as entered.

## Materials

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/materials/paste` | student | Save pasted text |
| POST | `/materials/upload` | student | Multipart PDF/DOCX; text extracted, file discarded |
| GET | `/materials` | student | Own materials |
| GET | `/materials/:id` | owner/teacher-of-class | One material |
| DELETE | `/materials/:id` | owner | Remove own material |

Upload responses report extraction status explicitly:

```json
{ "extracted": true, "chars": 4210, "sourceType": "pdf" }
```
```json
{ "error": { "code": "NO_TEXT_FOUND", "message": "Mukhang scanned ang PDF na ito. Hindi pa sinusuportahan ang OCR." } }
```

## Simplification

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/simplify` | student | `{ materialId, level, provider? }` → simplified text + vocabulary |
| GET | `/simplify/:id` | owner/teacher-of-class | Retrieve a stored result |

Server behavior:

- `level` must be one of `independent` | `instructional` | `frustration`.
- `provider` is optional; falls back to `AI_DEFAULT_PROVIDER`.
- Missing key → `503 AI_NOT_CONFIGURED` with the provider named.
- Provider timeout/error → `502 AI_PROVIDER_ERROR`; no partial or invented text is returned.
- Successful response includes `provider`, `model`, `cached` so the UI can be truthful.

## Vocabulary

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/vocabulary/explain` | student | Explain a specific word or phrase from a material |
| GET | `/vocabulary/:simplificationId` | owner | Stored entries |

## Activities

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/activities` | student | Generate MCQ set for a simplification |
| GET | `/activities/:id` | owner/teacher-of-class | Questions **without** `correct_index` |
| POST | `/activities/:id/attempts` | student | Submit answers; returns score + per-question feedback |
| GET | `/activities/:id/attempts` | owner/teacher-of-class | Attempt history |

`correct_index` is withheld until an attempt is submitted. Scoring happens on the server;
the client never learns the answer key in advance.

## Gamification

| Method | Path | Who | Purpose |
|---|---|---|---|
| GET | `/me/points` | student | Total + recent ledger entries |
| GET | `/me/badges` | student | Earned and locked badges |
| GET | `/quests` | student | Published quests for their class |
| POST | `/quests/:id/start` | student | Start a quest |
| POST | `/quest-steps/:id/complete` | student | Server verifies eligibility, then awards |
| GET | `/me/quests` | student | Progress per quest |

Award endpoints are idempotent: repeating a completion returns the existing award instead
of duplicating it.

## Progress

| Method | Path | Who | Purpose |
|---|---|---|---|
| GET | `/me/progress` | student | Activities, points, badges, quests in one payload |

## Teacher

| Method | Path | Who | Purpose |
|---|---|---|---|
| GET | `/teacher/classes` | teacher | Own classes |
| POST | `/teacher/classes` | teacher | Create class, returns `join_code` |
| POST | `/teacher/classes/:id/rotate-code` | teacher (owner) | New join code |
| GET | `/teacher/classes/:id/students` | teacher (owner) | Roster |
| GET | `/teacher/students/:id/progress` | teacher (owner of that student's class) | Progress |
| POST | `/teacher/materials` | teacher | Assign material to own class |
| GET | `/teacher/classes/:id/usage` | teacher (owner) | AI usage counts for cost awareness |

Every teacher route resolves ownership in SQL. A teacher from another class receives `404`,
not `403`, so the API does not confirm that the student exists.

## Deferred

- Password reset (needs email; out of MVP scope)
- Teacher grading of open-ended answers (MVP is MCQ only)
- Admin role
