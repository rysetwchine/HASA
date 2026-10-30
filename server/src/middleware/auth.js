import { config } from "../config.js";
import { findUserBySession, publicUser } from "../services/authService.js";
import { getDatabase } from "../db/database.js";
import { errors } from "../utils/errors.js";

export function parseCookies(header = "") {
  const cookies = {};
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  }
  return cookies;
}

function cookieAttributes() {
  const crossSite = Boolean(config.clientOrigin) && config.isProduction;
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: crossSite ? "None" : "Lax",
    path: "/",
    // Express reads `maxAge` in milliseconds; `sessionDays` is in days.
    // Passing seconds made every session cookie die after ~20 minutes.
    maxAge: config.sessionDays * 24 * 60 * 60 * 1000,
  };
}

export function setSessionCookie(res, token) {
  res.cookie(config.cookieName, token, cookieAttributes());
}

export function clearSessionCookie(res) {
  const { maxAge, ...attributes } = cookieAttributes();
  res.clearCookie(config.cookieName, attributes);
}

export function sessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[config.cookieName] || null;
}

export function optionalAuth(req, _res, next) {
  const token = sessionTokenFromRequest(req);
  const session = findUserBySession(token);
  if (session) {
    const user = publicUser(getDatabase(), session.userId);
    if (user) {
      req.user = user;
      req.auth = session;
    }
  }
  next();
}

export function requireAuth(req, _res, next) {
  if (!req.user) return next(errors.unauthorized());
  next();
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) return next(errors.unauthorized());
    if (req.user.role !== role) {
      return next(errors.forbidden("Wala kang pahintulot na buksan ang bahaging ito."));
    }
    next();
  };
}
