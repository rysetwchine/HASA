# HASA — Approved Requirements

Recorded from the approved requirements document. This file is the source of truth:
if a later decision conflicts with it, the conflict must be raised and resolved here
first, not silently changed in code.

> **Note:** The approved document was received with section 8 ("Development Strategy")
> as a heading with no body, and its text repeated three times. Sections 1–7 below are
> transcribed once, faithfully. Section 8 remains **unresolved** and must be supplied.

## 1. Users and Authentication

- HASA supports **students** and **teachers**.
- Students register and log in with a **username and password**.
- Teachers have their own accounts and teacher-specific features.
- Passwords are protected with **secure password hashing**.
- Student information is protected; access is restricted to authorized users.
- **No real student information** is used during development.

## 2. Language

- **Tagalog only.**
- Interface, navigation, instructions, explanations, simplified materials,
  comprehension questions, and feedback are all in Tagalog.
- Important academic concepts and the original meaning of source material are preserved.
- If source material is in another language, it is simplified **and explained** in Tagalog.

## 3. AI Integration

- Both **Google Gemini** and **OpenAI** are supported.
- All API keys stay on the **backend**.
- The system lets users **select a provider** where appropriate.
- API access is **not assumed to be free**.
- AI results are **never fabricated**, and mock responses are never presented as real output.
- The interface shows **clear errors** when a provider is not configured or unavailable.

## 4. Reading Levels

Three categories, used consistently:

- **Independent**
- **Instructional**
- **Frustration**

HASA must **not claim to accurately assess** a student's reading ability until a proper
assessment has been implemented and validated.

## 5. Learning Material Input

- Copy and paste text.
- Upload **PDF** and **Word** documents.
- Safe file validation and text extraction are required.
- Scanned PDFs are **not** assumed readable without OCR support.

## 6. Learning Features

- AI-powered text simplification
- Difficult-word explanations and vocabulary support
- Comprehension questions and feedback
- Points and badges
- Narrative-driven quests
- Student progress tracking
- Teacher features for assigning materials and monitoring authorized student progress

## 7. Technology Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Backend: Node.js + Express
- Database: SQLite
- Authentication: secure server-side sessions and password hashing
- Testing: Vitest and Supertest where appropriate
- Frontend and backend code stay separate.
- API keys and secrets never reach the browser.

## 8. Development Strategy

**Not received.** The approved document ended at this heading. Pending.

## Resolved decisions (this round)

| Question | Decision |
|---|---|
| Teacher ↔ student linking | **Class code** entered by the student at registration |
| Comprehension question types | **Multiple choice only** for the MVP |
| Reading-level labels in the UI | **Tagalog with the English term in parentheses** |
| Stage 0 scope | Docs + repo hygiene only; no packages, no source code |

## Open questions

| Question | Affects |
|---|---|
| Content of section 8 | Process rules for all stages |
| Hosting target and who pays | Stage 9 |
| Expected scale (one class vs school-wide) | Database choice at Stage 9 |
| Monthly AI budget cap | Stage 4 quota defaults |
| Quest narrative theme | Stage 6 |
| Whether teachers may also view their own class's AI usage/cost | Stage 7 |
