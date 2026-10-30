import {
  createHash,
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { config } from "../config.js";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt$${salt}$${Buffer.from(derived).toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  if (typeof stored !== "string") return false;
  const [algorithm, salt, expectedHex] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  try {
    const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
    const expected = Buffer.from(expectedHex, "hex");
    const actual = Buffer.from(derived);
    if (expected.length !== actual.length) return false;
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Ang SESSION_SECRET ay dating hinihingi sa production ngunit hindi ginagamit.
 * Ginagamit na ito ngayon bilang "pepper" sa pag-hash ng session token, kaya
 * kahit makuha ang database, hindi magagamit ang token_hash para gumawa ng
 * bisitang session. Sa development lamang ginagamit ang fallback; hinihingi
 * pa rin ng `assertProductionConfig()` ang tunay na secret sa production.
 */
export function hashSessionToken(token) {
  const pepper = config.sessionSecret || "hasa-development-pepper";
  return createHmac("sha256", pepper).update(token).digest("hex");
}

const JOIN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createJoinCode() {
  let code = "";
  const bytes = randomBytes(6);
  for (const byte of bytes) code += JOIN_ALPHABET[byte % JOIN_ALPHABET.length];
  return `HASA-${code}`;
}

export function createTemporaryPassword() {
  const bytes = randomBytes(6);
  let code = "";
  for (const byte of bytes) code += JOIN_ALPHABET[byte % JOIN_ALPHABET.length];
  return `Hasa-${code}`;
}
