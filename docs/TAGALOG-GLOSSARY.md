# HASA — Tagalog Glossary

The interface is Tagalog only. This file fixes one rendering per concept so screens, error
messages, and AI prompts stay consistent.

**Rule:** prefer plain Tagalog a Grade 8 student reads easily. Where an academic or
technical term matters, keep the original in parentheses on first use.

**Status:** proposed. Needs review by a Filipino/Reading teacher before Stage 1 is signed off.

## Navigation and actions

| English | Tagalog (UI) |
|---|---|
| Home | Simula |
| Log in | Mag-log in |
| Log out | Mag-log out |
| Register / Sign up | Magrehistro |
| Username | Username |
| Password | Password |
| Save | I-save |
| Cancel | Kanselahin |
| Submit | Isumite |
| Next | Susunod |
| Back | Bumalik |
| Retry | Subukan muli |
| Close | Isara |
| Upload | Mag-upload |
| Paste | I-paste |
| Copy | Kopyahin |
| Choose file | Pumili ng file |

## Roles and classes

| English | Tagalog (UI) |
|---|---|
| Student | Mag-aaral |
| Teacher | Guro |
| Class | Klase |
| Class code | Kodigo ng Klase |
| Section | Seksyon |
| Assignment | Takdang Gawain |
| Assigned material | Itinalagang Materyal |

## Learning content

| English | Tagalog (UI) |
|---|---|
| Learning material | Kagamitang Pampagkatuto |
| Self-Learning Module (SLM) | Modyul sa Sariling Pagkatuto (SLM) |
| Original text | Orihinal na Teksto |
| Simplified text | Pinasimpleng Teksto |
| Simplify | Pasimplehin |
| Reading level | Antas ng Pagbasa |
| Difficult word | Mahirap na Salita |
| Vocabulary | Talasalitaan |
| Explanation | Paliwanag |
| Example sentence | Halimbawang Pangungusap |
| Comprehension question | Tanong sa Pag-unawa |
| Answer | Sagot |
| Feedback | Puna |
| Score | Puntos ng Pagsusulit |
| Correct | Tama |
| Incorrect | Mali |
| Review | Balik-aralan |

## Reading levels (approved names, Tagalog rendering)

Canonical stored keys stay lowercase English.

| Stored key | Displayed in UI |
|---|---|
| `independent` | Malayang Pagbasa (Independent) |
| `instructional` | May Gabay na Pagbasa (Instructional) |
| `frustration` | Nahihirapang Pagbasa (Frustration) |

**Never** render these as a diagnosis. The picker asks *"Anong antas ang gusto mong
basahin?"* — not *"Anong antas ng pagbasa mo?"* HASA does not measure reading ability.

## Gamification

| English | Tagalog (UI) |
|---|---|
| Points | Puntos |
| Badge | Sagisag |
| Quest | Misyon (Quest) |
| Quest step | Hakbang sa Misyon |
| Reward | Gantimpala |
| Achievement | Nakamit |
| Progress | Pag-unlad |
| Dashboard | Tanawan |
| Level up | Umangat sa Antas |
| Completed | Natapos |
| Locked | Nakakandado |

## Errors and states

| English | Tagalog (UI) |
|---|---|
| Loading… | Naglo-load… |
| Something went wrong | May problema. Subukan muli. |
| Provider not configured | Hindi naka-configure ang AI provider. |
| Provider unavailable | Pansamantalang hindi available ang AI. Subukan muli mamaya. |
| Daily limit reached | Naabot mo na ang limitasyon para ngayong araw. |
| File too large | Masyadong malaki ang file. |
| Unsupported file type | Hindi suportadong uri ng file. |
| No text found (scanned) | Mukhang scanned ang PDF. Hindi pa sinusuportahan ang OCR. |
| Wrong username or password | Mali ang username o password. |
| Not allowed | Wala kang pahintagang gawin ito. |
| Not found | Hindi mahanap ang hinahanap mo. |

## Writing rules

1. Second person, friendly but not childish: *"Piliin ang antas…"*, not *"Pumili ka ng…"* —
   keep it consistent once chosen.
2. Avoid English verbs where a natural Tagalog exists (*isumite*, not *submit-in*).
3. Keep UI labels short — mobile screens are narrow.
4. Error messages say **what happened** and **what to do next**, in one or two sentences.
5. Never blame the student for a system failure.
6. Do not translate the canonical reading-level names; pair them instead.
