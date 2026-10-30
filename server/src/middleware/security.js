import { config } from "../config.js";
import { errors } from "../utils/errors.js";

const attempts = new Map();

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 20, keyPrefix = "general" } = {}) {
  return (req, _res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip}`;
    const entry = attempts.get(key);

    if (!entry || entry.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      return next(
        errors.tooMany("Masyado nang maraming pagtatangka. Subukan muli mamaya."),
      );
    }
    next();
  };
}

export function resetRateLimits() {
  attempts.clear();
}

function allowedOrigins(req) {
  const origins = new Set();
  if (config.clientOrigin) origins.add(config.clientOrigin);
  if (!config.isProduction) {
    origins.add("http://localhost:5173");
    origins.add("http://127.0.0.1:5173");
    origins.add("http://localhost:4173");
    origins.add("http://127.0.0.1:4173");
  }
  const host = req.get("host");
  if (host) {
    origins.add(`https://${host}`);
    origins.add(`http://${host}`);
  }
  return origins;
}

export function cors(req, res, next) {
  const origin = req.get("origin");
  if (origin && allowedOrigins(req).has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
}

/**
 * SameSite cookies are the primary CSRF defense. This adds a second check:
 * any state-changing browser request that declares an Origin must come from
 * the configured client or the API's own origin.
 */
export function verifyOrigin(req, _res, next) {
  if (!["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (!origin) return next();
  if (allowedOrigins(req).has(origin)) return next();
  next(errors.forbidden("Hindi tinatanggap ang kahilingan mula sa hindi kilalang pinagmulan."));
}
