import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(here, "..");

function integer(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function boolean(value, fallback = false) {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const clientOrigin = (process.env.CLIENT_ORIGIN || "").trim().replace(/\/$/, "");

export const config = {
  nodeEnv,
  isProduction,
  port: integer(process.env.PORT, 3000),
  serverRoot,
  databasePath:
    process.env.DATABASE_PATH || path.join(serverRoot, "data", "hasa.sqlite"),
  sessionSecret: process.env.SESSION_SECRET || "",
  sessionDays: integer(process.env.SESSION_DAYS, 14),
  clientOrigin,
  trustProxy: boolean(process.env.TRUST_PROXY, isProduction),
  teacherSignupCode: process.env.TEACHER_SIGNUP_CODE || "",
  cookieName: "hasa_session",
  ai: {
    defaultProvider: process.env.AI_DEFAULT_PROVIDER || "gemini",
    geminiKey: process.env.GEMINI_API_KEY || "",
    openaiKey: process.env.OPENAI_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    maxInputChars: integer(process.env.AI_MAX_INPUT_CHARS, 8000),
    maxOutputTokens: integer(process.env.AI_MAX_OUTPUT_TOKENS, 1200),
    dailyQuota: integer(process.env.AI_DAILY_QUOTA_PER_STUDENT, 20),
    timeoutMs: integer(process.env.AI_REQUEST_TIMEOUT_MS, 45000),
  },
};

export function configuredAiProviders() {
  return {
    gemini: Boolean(config.ai.geminiKey),
    openai: Boolean(config.ai.openaiKey),
  };
}

export function assertProductionConfig() {
  if (!config.isProduction) return;
  const problems = [];
  if (!config.sessionSecret || config.sessionSecret.length < 32) {
    problems.push("SESSION_SECRET must be at least 32 characters.");
  }
  if (!config.clientOrigin && process.env.VERCEL) {
    problems.push("CLIENT_ORIGIN must be set when the API and client use different domains.");
  }
  // The signup form itself requires 6–80 characters; a shorter code would make
  // every teacher registration fail with a validation error.
  if (config.teacherSignupCode && config.teacherSignupCode.length < 6) {
    problems.push(
      "TEACHER_SIGNUP_CODE must be at least 6 characters, or teacher signup will always fail validation.",
    );
  }
  if (problems.length > 0) {
    throw new Error(`Invalid production configuration:\n- ${problems.join("\n- ")}`);
  }
}
