# HASA — AI Setup and Integration

Two providers: **Google Gemini** and **OpenAI**. Keys live only in `server/.env`.
Nothing here is implemented yet; this is the specification for Stage 4.

## Honest limits

- **API access is not assumed to be free.** Both providers bill per token. Free tiers, if
  they exist, change without notice and have their own limits.
- Model names in this document are deliberately left as configuration values. Verify the
  current model ID in each provider's documentation before setting `GEMINI_MODEL` or
  `OPENAI_MODEL`.
- HASA will never present canned text as a provider's answer. If no key is configured, the
  feature says so.

## Configuration

```bash
# server/.env
AI_DEFAULT_PROVIDER=gemini
GEMINI_API_KEY=...
OPENAI_API_KEY=...
GEMINI_MODEL=          # leave blank to use the adapter default
OPENAI_MODEL=
```

`server/src/config/env.js` validates these at startup and logs which providers are
configured — never the key values, and never more than the last four characters if a hint
is needed for debugging.

## Adapter interface

```js
// services/ai/provider.js
getProvider(name) // 'gemini' | 'openai'
  .isConfigured()                       // key present and non-empty
  .simplify({ text, level, signal })    // → { text, vocabulary[], model }
  .explainWords({ text, words, signal })
  .generateQuestions({ text, level, count, signal })
```

Normalized result:

```js
{
  text: "...",            // Tagalog
  vocabulary: [{ word, explanation, exampleSentence }],
  provider: "gemini",
  model: "<as reported>",
  usage: { inputChars, outputChars }
}
```

The service layer never branches on provider internals — only on this shape. Adding a third
provider later means one new file.

## Prompt requirements

Every prompt must enforce:

1. **Output in Tagalog.** Not a translation pass — a simplification that keeps the concept.
2. **Preserve academic meaning.** Technical terms stay recognizable; show the original term
   in parentheses where it helps.
3. **Reading-level rules**, mapped from the canonical keys:
   - `independent` — short sentences, common words, minimal scaffolding
   - `instructional` — moderate sentences, brief glosses for hard terms
   - `frustration` — very short sentences, concrete examples, step-by-step explanation
4. **No invented facts.** If the source is ambiguous, say so rather than filling gaps.
5. **Structured output.** Questions and vocabulary are requested as JSON matching a schema,
   then validated. Invalid JSON is a failure, not something to patch with a regex.
6. **No personal data.** Names and identifiers are stripped before sending.

`promptVersion` (e.g. `simplify-tl-v1`) is stored with every result so old outputs remain
explainable after prompts change.

## Error handling

| Situation | Response |
|---|---|
| No key for chosen provider | `503 AI_NOT_CONFIGURED` — names the provider, offers the other |
| Both providers unconfigured | `503 AI_NOT_CONFIGURED` — AI features visibly disabled |
| Timeout | `502 AI_PROVIDER_TIMEOUT` |
| Provider 4xx (bad request, model missing) | `502 AI_PROVIDER_ERROR` — logged with detail, Tagalog message to user |
| Provider 429 / quota | `429 AI_QUOTA_EXCEEDED` — no automatic retry loop |
| Invalid JSON from model | one retry, then `502 AI_BAD_OUTPUT` |
| Daily student quota reached | `429 AI_DAILY_LIMIT` |

**No fallback that hides the truth.** If the user picked Gemini and it failed, the error says
Gemini failed. Automatic switching to OpenAI is opt-in, and the response still records which
provider produced the text.

## Cost controls

- `AI_MAX_INPUT_CHARS` (default 8000) — reject longer input before spending tokens.
- `AI_MAX_OUTPUT_TOKENS` (default 1200).
- Response cache: hash of `text + level + provider + model + promptVersion`; a hit costs nothing
  and returns `cached: true`.
- `AI_DAILY_QUOTA_PER_STUDENT` (default 30) tracked in `ai_usage`.
- Timeout `AI_REQUEST_TIMEOUT_MS`; exponential backoff only for transient 5xx/network errors,
  never for 429.

## Privacy

- Send only the learning text. No usernames, display names, class codes, or IDs.
- Do not log full student text or any key. Log provider, operation, char counts, outcome.
- Uploaded files are never sent as files — only extracted text, after validation.

## Testing

| Level | Approach |
|---|---|
| Unit | Fake adapter returns fixed fixtures; no network, no cost |
| Prompt | Snapshot tests on the built prompt string, per level and provider |
| Contract | Real-provider tests skipped unless the relevant key is present in the environment |
| Manual smoke test | One script, run by a human with real keys, prints provider/model/latency |

The fake adapter's output is **labelled as a fixture** in the UI and in tests. It must never
be reachable in production configuration, and its presence must not be mistaken for a working
AI integration.

## Manual verification checklist (Stage 4)

1. Set only `GEMINI_API_KEY`. Confirm Gemini works and OpenAI reports "hindi naka-configure".
2. Set only `OPENAI_API_KEY`. Confirm the reverse.
3. Unset both. Confirm every AI action shows a clear Tagalog error and no fake text.
4. Simplify the same material at all three levels. Confirm output is Tagalog and the
   difficulty visibly differs.
5. Submit an English source. Confirm the result explains it in Tagalog rather than merely
   translating.
6. Exceed the daily quota. Confirm `429` and no further provider calls.
7. Re-request an identical simplification. Confirm `cached: true` and no new spend.
8. Inspect the browser bundle. Confirm no key material is present.
