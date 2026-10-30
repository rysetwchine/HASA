import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

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
