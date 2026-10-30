# Optional: same-origin `/api` proxy on Vercel

**Default (nothing to do):** the client talks to the API cross-origin. The server
already sends `SameSite=None; Secure` cookies and echoes `CLIENT_ORIGIN` in CORS, so
login works on Chrome, Edge, Firefox, and Safari in normal browsing.

**When to use this proxy:** some browsers and privacy modes block third-party cookies
outright (Safari "Prevent cross-site tracking", Brave shields, Chrome with third-party
cookies disabled). Routing `/api/*` through the Vercel domain makes the session cookie
first-party and removes the whole class of problems.

## How

1. Keep the client talking to its own origin — leave `VITE_API_URL` **empty** in Vercel.
2. Add this rewrite as the **first** entry of `rewrites` in the `vercel.json` that your
   Vercel project actually uses (root `vercel.json`, or `client/vercel.json` if the
   project's Root Directory is `client`). Replace the host with your Render URL:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://hasa-api.onrender.com/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

3. Redeploy. Requests now go `https://hasa-xtg1.vercel.app/api/...` →
   `https://hasa-api.onrender.com/api/...`, and the browser sees only one origin.

## Server side when the proxy is used

The API still needs to know the **browser** origin, not the proxy:

- `CLIENT_ORIGIN=https://hasa-xtg1.vercel.app` — unchanged.
- The browser request now has no `Origin: https://hasa-xtg1.vercel.app` difference, but
  Vercel forwards `Origin`/`Referer`; `verifyOrigin` accepts the configured origin and
  the same-host case. Nothing else to change.
- Cookies become first-party, so `SameSite=None` is no longer required — the server
  keeps it anyway (harmless).
- Set `TRUST_PROXY=1` so `req.ip` and rate limiting see the real client through
  Render's proxy.

## Verifying it works

```bash
curl -i https://hasa-xtg1.vercel.app/api/health
# HTTP/2 200 + {"status":"ok"}  ← the proxy is live
```

Then in the browser: log in, open DevTools → Application → Cookies → the session cookie
is scoped to `hasa-xtg1.vercel.app`, and `/api/auth/me` returns 200 on reload.

## Limits worth knowing

- Vercel's rewrite proxy has no streaming/timeout control beyond the platform defaults;
  the AI simplification call can take up to `AI_REQUEST_TIMEOUT_MS` (45 s). If it times
  out at the edge, keep the direct cross-origin setup for that deployment instead.
- Rewrites are stateless — they do **not** make the Render free instance wake up faster.
  The first request after idle still takes ~30–60 s; the client shows its Tagalog
  loading state while that happens.
