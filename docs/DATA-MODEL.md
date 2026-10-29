# HASA — Data Model

SQLite. Migrations are numbered SQL files in `server/src/db/migrations/`.

## Design principles

1. **Points are an append-only ledger.** Totals are derived with `SUM`, never stored as a
   mutable counter. This makes awards auditable and prevents double-awarding.
2. **Rewards are decided server-side.** The client reports an event; the server validates
   the rules before inserting a ledger row.
3. **Teacher access is scoped by class.** Every teacher query joins through `classes`.
4. **No real student data.** Seed data uses fictional names (`estudyante1`, `guro1`).

## Tables

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `username` | TEXT UNIQUE NOT NULL | Login identifier |
| `password_hash` | TEXT NOT NULL | argon2id |
| `role` | TEXT NOT NULL | `student` \| `teacher` |
| `display_name` | TEXT NOT NULL | Fictional in development |
| `class_id` | INTEGER NULL FK → `classes.id` | Students only |
| `reading_level` | TEXT NULL | `independent` \| `instructional` \| `frustration` — **chosen**, not measured |
| `is_active` | INTEGER NOT NULL DEFAULT 1 | Soft disable |
| `created_at` | TEXT NOT NULL | ISO 8601 UTC |

Constraint: `role = 'student'` may have `class_id` and `reading_level`;
`role = 'teacher'` must not.

### `classes`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `name` | TEXT NOT NULL | e.g. "Baitang 8 — Seksyon A" |
| `join_code` | TEXT UNIQUE NOT NULL | Short code students enter at registration |
| `teacher_id` | INTEGER NOT NULL FK → `users.id` | Owner |
| `created_at` | TEXT NOT NULL | |

`join_code` is regenerable. Rotating it must not unlink existing students.

### `sessions`

Server-side session store (used by `express-session`). Holds session id, serialized data,
and expiry. Logging out deletes the row — that is what makes revocation real.

### `materials`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `student_id` | INTEGER NULL FK | Null when teacher-assigned |
| `class_id` | INTEGER NULL FK | Set when teacher-assigned |
| `created_by` | INTEGER NOT NULL FK → `users.id` | Student or teacher |
| `title` | TEXT NOT NULL | |
| `source_type` | TEXT NOT NULL | `paste` \| `pdf` \| `docx` |
| `original_text` | TEXT NOT NULL | Extracted/plain text only; **no file is stored** |
| `source_language` | TEXT NULL | Detected/declared; used to tell the model to explain in Tagalog |
| `is_assigned` | INTEGER NOT NULL DEFAULT 0 | Teacher assignment flag |
| `created_at` | TEXT NOT NULL | |

### `simplifications`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `material_id` | INTEGER NOT NULL FK | |
| `student_id` | INTEGER NOT NULL FK | Who requested it |
| `reading_level` | TEXT NOT NULL | Canonical key |
| `simplified_text` | TEXT NOT NULL | Tagalog output |
| `provider` | TEXT NOT NULL | `gemini` \| `openai` — the one that actually answered |
| `model` | TEXT NOT NULL | As reported by the provider |
| `prompt_version` | TEXT NOT NULL | Ties output to the prompt that produced it |
| `input_chars` | INTEGER | Cost tracking |
| `output_chars` | INTEGER | Cost tracking |
| `cached` | INTEGER NOT NULL DEFAULT 0 | Served from cache |
| `created_at` | TEXT NOT NULL | |

Unique index on `(material_id, reading_level, provider, model, prompt_version)`
supports the cache lookup described in `AI-SETUP.md`.

### `vocabulary_entries`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `simplification_id` | INTEGER NOT NULL FK | |
| `word` | TEXT NOT NULL | The difficult term |
| `explanation` | TEXT NOT NULL | Tagalog explanation |
| `example_sentence` | TEXT NULL | Tagalog example |
| `created_at` | TEXT NOT NULL | |

### `activities`

A comprehension check generated from a material.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `material_id` | INTEGER NOT NULL FK | |
| `simplification_id` | INTEGER NULL FK | Questions target the simplified version |
| `title` | TEXT NOT NULL | |
| `provider` | TEXT NOT NULL | Generator provenance |
| `model` | TEXT NOT NULL | |
| `prompt_version` | TEXT NOT NULL | |
| `created_at` | TEXT NOT NULL | |

### `questions`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `activity_id` | INTEGER NOT NULL FK | |
| `position` | INTEGER NOT NULL | Display order |
| `prompt` | TEXT NOT NULL | Tagalog question |
| `options_json` | TEXT NOT NULL | JSON array of choices |
| `correct_index` | INTEGER NOT NULL | **Never sent to the client before answering** |
| `explanation` | TEXT NULL | Tagalog feedback for wrong answers |

### `attempts`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `activity_id` | INTEGER NOT NULL FK | |
| `student_id` | INTEGER NOT NULL FK | |
| `score` | INTEGER NOT NULL | Correct answers |
| `total` | INTEGER NOT NULL | Question count |
| `completed_at` | TEXT NOT NULL | |

### `answers`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `attempt_id` | INTEGER NOT NULL FK | |
| `question_id` | INTEGER NOT NULL FK | |
| `selected_index` | INTEGER NOT NULL | |
| `is_correct` | INTEGER NOT NULL | Scored server-side |
| `answered_at` | TEXT NOT NULL | |

### `points_ledger`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `student_id` | INTEGER NOT NULL FK | |
| `delta` | INTEGER NOT NULL | Positive awards; negative only for admin corrections |
| `reason_code` | TEXT NOT NULL | e.g. `activity_completed`, `quest_step_completed` |
| `ref_type` | TEXT NULL | `attempt` \| `quest_step` \| `badge` |
| `ref_id` | INTEGER NULL | |
| `created_at` | TEXT NOT NULL | |

Unique index on `(student_id, reason_code, ref_type, ref_id)` prevents the same event from
awarding twice. Totals: `SELECT SUM(delta) FROM points_ledger WHERE student_id = ?`.

### `badges`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `code` | TEXT UNIQUE NOT NULL | Stable identifier |
| `name_tl` | TEXT NOT NULL | Tagalog display name |
| `description_tl` | TEXT NOT NULL | Tagalog description |
| `rule_json` | TEXT NOT NULL | Declarative award rule |
| `icon` | TEXT NULL | Asset reference |

### `student_badges`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `student_id` | INTEGER NOT NULL FK | |
| `badge_id` | INTEGER NOT NULL FK | |
| `awarded_at` | TEXT NOT NULL | |

Unique index on `(student_id, badge_id)`.

### `quests`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `code` | TEXT UNIQUE NOT NULL | |
| `title_tl` | TEXT NOT NULL | |
| `narrative_tl` | TEXT NOT NULL | Story framing, Tagalog |
| `class_id` | INTEGER NULL FK | Null = global quest |
| `is_published` | INTEGER NOT NULL DEFAULT 0 | |

### `quest_steps`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `quest_id` | INTEGER NOT NULL FK | |
| `position` | INTEGER NOT NULL | Order |
| `title_tl` | TEXT NOT NULL | |
| `instructions_tl` | TEXT NOT NULL | |
| `activity_id` | INTEGER NULL FK | Optional linked activity |
| `points_reward` | INTEGER NOT NULL DEFAULT 0 | |

### `student_quests` / `student_quest_steps`

`student_quests` holds `(student_id, quest_id, started_at, completed_at)`.
`student_quest_steps` holds `(student_id, quest_step_id, completed_at)` with a unique
index on the pair, so a step can be completed once.

### `ai_usage`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `student_id` | INTEGER NOT NULL FK | |
| `provider` | TEXT NOT NULL | |
| `operation` | TEXT NOT NULL | `simplify` \| `explain` \| `questions` |
| `input_chars` | INTEGER | |
| `output_chars` | INTEGER | |
| `succeeded` | INTEGER NOT NULL | |
| `error_code` | TEXT NULL | |
| `created_at` | TEXT NOT NULL | |

Backs the daily quota and lets a teacher see cost per class without exposing prompts.

## Derived views

- **Student progress** = attempts + `SUM(points_ledger.delta)` + `student_badges` +
  completed `student_quest_steps`.
- **Teacher class progress** = the same, joined through `classes` and filtered by
  `classes.teacher_id`.
