import { errors } from "./errors.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/;
const JOIN_CODE_PATTERN = /^[A-Z0-9-]{5,20}$/;
const LEVELS = new Set(["independent", "instructional", "frustration"]);

export function text(value, field, { min = 1, max = 2000 } = {}) {
  if (typeof value !== "string") {
    throw errors.validation(`Mangyaring ilagay ang ${field}.`);
  }
  const clean = value.trim();
  if (clean.length < min) {
    throw errors.validation(`Masyadong maikli ang ${field}.`);
  }
  if (clean.length > max) {
    throw errors.validation(`Masyadong mahaba ang ${field}.`);
  }
  return clean;
}

export function username(value) {
  const clean = text(value, "username", { min: 3, max: 30 });
  if (!USERNAME_PATTERN.test(clean)) {
    throw errors.validation(
      "Gumamit lamang ng 3–30 letra, numero, tuldok, gitling, o underscore sa username.",
    );
  }
  return clean;
}

export function password(value, label = "password") {
  if (typeof value !== "string" || value.length < 8 || value.length > 128) {
    throw errors.validation(`Dapat may 8–128 na karakter ang ${label}.`);
  }
  return value;
}

export function joinCode(value) {
  const clean = text(value, "kodigo ng klase", { min: 5, max: 20 })
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!JOIN_CODE_PATTERN.test(clean)) {
    throw errors.validation("Mukhang hindi wasto ang kodigo ng klase.");
  }
  return clean;
}

export function readingLevel(value, { optional = false } = {}) {
  if (value === undefined || value === null || value === "") {
    if (optional) return null;
    throw errors.validation("Pumili ng antas ng pagbasa.");
  }
  if (!LEVELS.has(value)) {
    throw errors.validation("Hindi wasto ang napiling antas ng pagbasa.");
  }
  return value;
}

export function integer(value, field, { min = 0, max = 100000 } = {}) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw errors.validation(`Hindi wasto ang ${field}.`);
  }
  return number;
}

export function boolean(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return Boolean(value);
}

export function id(value, field = "record") {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw errors.notFound(`Hindi mahanap ang ${field}.`);
  }
  return number;
}

export function email(value) {
  const clean = text(value, "email", { min: 5, max: 120 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    throw errors.validation("Hindi wasto ang email address.");
  }
  return clean;
}
