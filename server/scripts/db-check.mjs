#!/usr/bin/env node
/*
 * db-check.mjs — verify the HASA database that the current environment points at.
 *
 *   node --env-file-if-exists=.env scripts/db-check.mjs          # read-only checks
 *   node --env-file-if-exists=.env scripts/db-check.mjs --init   # create schema + seed
 *   node --env-file-if-exists=.env scripts/db-check.mjs --json   # machine-readable
 *
 * Gumagamit ito ng parehong driver na ginagamit ng API, kaya kung ano ang
 * nakikita rito ay siya ring makikita ng server: Turso kapag may
 * TURSO_DATABASE_URL, lokal na SQLite kapag wala.
 *
 * READ-ONLY ito maliban sa --init. Ang --init ay idempotent: CREATE TABLE IF NOT
 * EXISTS para sa schema at upsert lamang ng platform content (lessons, activities,
 * quizzes, badges). HINDI nito ginagalaw ang users, sessions, attempts,
 * lesson_progress, o points_ledger ng mga mag-aaral.
 *
 * Exit code: 0 = malusog, 1 = may problema (kulang na table, orphan, FK error),
 * 2 = hindi makakonekta.
 */
import { config } from "../src/config.js";
import { SCHEMA } from "../src/db/schema.js";
import { closeDatabase, createDriver, initDatabase } from "../src/db/database.js";

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const doInit = args.has("--init");

const EXPECTED_TABLES = [
  ...SCHEMA.matchAll(/CREATE TABLE IF NOT EXISTS\s+([a-z_]+)/gi),
].map((match) => match[1]);

const COUNTED_TABLES = [
  "users",
  "sessions",
  "classes",
  "lessons",
  "activities",
  "questions",
  "attempts",
  "attempt_answers",
  "lesson_progress",
  "points_ledger",
  "badges",
  "student_badges",
  "simplifications",
  "ai_usage",
];

const RELATIONS = [
  {
    name: "students without a class",
    sql: "SELECT COUNT(*) AS n FROM users u WHERE u.role = 'student' AND u.class_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.id = u.class_id)",
  },
  {
    name: "attempts without a student",
    sql: "SELECT COUNT(*) AS n FROM attempts a WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = a.student_id)",
  },
  {
    name: "points without a student",
    sql: "SELECT COUNT(*) AS n FROM points_ledger p WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.student_id)",
  },
  {
    name: "lesson_progress without a lesson",
    sql: "SELECT COUNT(*) AS n FROM lesson_progress lp WHERE NOT EXISTS (SELECT 1 FROM lessons l WHERE l.id = lp.lesson_id)",
  },
];

const report = {
  ok: false,
  driver: null,
  target: null,
  tokenConfigured: Boolean(config.tursoAuthToken),
  latencyMs: null,
  initialised: false,
  missingTables: [],
  counts: {},
  content: {},
  relations: [],
  foreignKeyViolations: null,
  failure: null,
  problems: [],
};

const out = (line = "") => {
  if (!asJson) console.log(line);
};

/**
 * Ibahin ang tunay na sanhi ng pagpalya: network, auth, o maling URL.
 * "fetch failed" lamang ang isinusuka ng fetch API — hindi nito sinasabi kung
 * offline ang makina o mali ang token, at magkaiba ang lunas.
 */
function classify(error) {
  const text = `${error?.message ?? ""} ${error?.cause?.code ?? ""} ${error?.code ?? ""}`;
  if (/ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNREFUSED|EHOSTUNREACH|UND_ERR|fetch failed|socket/i.test(text)) {
    return "network";
  }
  if (/401|403|unauthor|forbidden|jwt|token|auth/i.test(text)) return "auth";
  if (/404|not found|database/i.test(text)) return "url";
  return "unknown";
}

function describeTarget() {
  if (config.tursoUrl) {
    // Huwag kailanman i-print ang token — host o path lang ang ipakita.
    if (config.tursoUrl.startsWith("file:")) {
      return `turso driver (${config.tursoUrl})`;
    }
    const host = config.tursoUrl.replace(/^(libsql|https?):\/\//, "").replace(/\/.*$/, "");
    return `turso (${host})`;
  }
  return `local (${config.databasePath})`;
}

async function main() {
  report.driver = config.tursoUrl ? "turso" : "local";
  report.target = describeTarget();

  out("HASA database check");
  out(`  driver : ${report.driver}`);
  out(`  target : ${report.target}`);
  if (config.tursoUrl) {
    out(
      `  token  : ${config.tursoAuthToken ? "set (hidden)" : "MISSING — set TURSO_AUTH_TOKEN"}`,
    );
  }
  out("");

  const started = Date.now();
  let driver;
  try {
    if (doInit) {
      const db = initDatabase();
      await db.ready;
      report.initialised = true;
      await closeDatabase();
    }
    driver = createDriver();
    await driver.all("SELECT 1 AS ok", []);
  } catch (error) {
    report.latencyMs = Date.now() - started;
    report.problems.push(error.message);
    report.failure = classify(error);
    finish(2);
    return;
  }
  report.latencyMs = Date.now() - started;
  out(`  connected in ${report.latencyMs} ms`);
  if (report.initialised) out("  schema + platform content initialised (idempotent)");
  out("");

  try {
    const tables = (
      await driver.all("SELECT name FROM sqlite_master WHERE type = 'table'", [])
    ).map((row) => row.name);
    report.missingTables = EXPECTED_TABLES.filter((name) => !tables.includes(name));

    out("Schema");
    if (report.missingTables.length === 0) {
      out(`  ✔ all ${EXPECTED_TABLES.length} tables present`);
    } else {
      out(`  ✘ missing: ${report.missingTables.join(", ")}`);
      out("    run: npm run db:init");
      report.problems.push(`${report.missingTables.length} table(s) missing`);
    }
    out("");

    if (report.missingTables.length === 0) {
      out("Rows");
      for (const table of COUNTED_TABLES) {
        const row = await driver.all(`SELECT COUNT(*) AS n FROM ${table}`, []);
        const n = Number(row[0]?.n ?? 0);
        report.counts[table] = n;
        out(`  ${table.padEnd(16)} ${String(n).padStart(6)}`);
      }
      out("");

      const platform = await driver.all(
        "SELECT COUNT(*) AS n FROM lessons WHERE class_id IS NULL AND created_by IS NULL",
        [],
      );
      const quizzes = await driver.all(
        "SELECT COUNT(*) AS n FROM activities WHERE kind = 'quiz'",
        [],
      );
      const activityCount = await driver.all(
        "SELECT COUNT(*) AS n FROM activities",
        [],
      );
      const badges = await driver.all("SELECT COUNT(*) AS n FROM badges", []);
      report.content = {
        platformLessons: Number(platform[0]?.n ?? 0),
        activities: Number(activityCount[0]?.n ?? 0),
        quizzes: Number(quizzes[0]?.n ?? 0),
        badges: Number(badges[0]?.n ?? 0),
      };
      out("Seeded content");
      out(`  platform lessons ${report.content.platformLessons}, activities ${report.content.activities}, quizzes ${report.content.quizzes}, badges ${report.content.badges}`);
      if (report.content.platformLessons < 1 || report.content.badges < 1) {
        report.problems.push("platform content missing — run: npm run db:init");
        out("  ✘ curriculum/badges missing");
      } else {
        out("  ✔ curriculum and badges present");
      }
      out("");

      out("Relationships");
      for (const relation of RELATIONS) {
        const row = await driver.all(relation.sql, []);
        const n = Number(row[0]?.n ?? 0);
        report.relations.push({ name: relation.name, orphans: n });
        out(`  ${n === 0 ? "✔" : "✘"} ${relation.name}: ${n}`);
        if (n > 0) report.problems.push(`${relation.name}: ${n}`);
      }

      try {
        const fk = await driver.all("PRAGMA foreign_key_check", []);
        report.foreignKeyViolations = fk.length;
        out(`  ${fk.length === 0 ? "✔" : "✘"} foreign_key_check: ${fk.length} violation(s)`);
        if (fk.length > 0) report.problems.push(`${fk.length} foreign key violation(s)`);
      } catch {
        // Hindi lahat ng libSQL deployment ay nagbibigay ng pragma na ito.
        report.foreignKeyViolations = null;
        out("  • foreign_key_check not supported by this server — skipped");
      }
      out("");
    }
  } finally {
    await driver.close();
  }

  report.ok = report.problems.length === 0;
  finish(report.ok ? 0 : 1);
}

function finish(code) {
  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(code);
  }
  if (code === 0) {
    out("RESULT: OK — the API will use this database unchanged.");
  } else if (code === 2) {
    out(`RESULT: CONNECTION FAILED — ${report.problems[0]}`);
    out("");
    if (config.tursoUrl && !config.tursoAuthToken) {
      out("  • TURSO_AUTH_TOKEN is empty — paste the token into server/.env");
    } else if (report.failure === "network") {
      out("  • Cannot reach the Turso host at all (DNS/TCP/TLS failed before any query).");
      out("    Wrong token or wrong database: NOT the cause here — nothing was sent.");
      out("    Check: internet connection, VPN/school firewall, `curl -v https://<host>`.");
    } else if (report.failure === "auth") {
      out("  • The host answered but rejected the credentials.");
      out("    Get a fresh token: turso db tokens create hasa");
    } else if (report.failure === "url") {
      out("  • The host answered 404 — TURSO_DATABASE_URL probably names the wrong database.");
      out("    Copy it from: turso db show hasa --url");
    } else if (config.tursoUrl) {
      out("  • Turso: check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (server/.env).");
    } else {
      out("  • Local: check that DATABASE_PATH is writable");
    }
  } else {
    out("RESULT: PROBLEMS FOUND");
    for (const problem of report.problems) out(`  • ${problem}`);
  }
  process.exit(code);
}

main().catch((error) => {
  if (asJson) console.log(JSON.stringify({ ...report, problems: [error.message] }, null, 2));
  else console.error("db-check failed:", error.message);
  process.exit(2);
});
