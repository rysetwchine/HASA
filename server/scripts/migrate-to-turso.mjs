#!/usr/bin/env node
/**
 * HASA — ligtas na paglilipat ng datos mula sa lokal na SQLite papuntang Turso.
 *
 *   DATABASE_PATH=./server/data/hasa.sqlite \
 *   TURSO_DATABASE_URL=libsql://hasa-<org>.turso.io \
 *   TURSO_AUTH_TOKEN=<token> \
 *   node server/scripts/migrate-to-turso.mjs
 *
 * Mga flag:
 *   --dry-run            Basahin at bilangin lamang; walang isusulat sa Turso.
 *   --backup-dir=DIR     Saan ilalagay ang backup (default: server/backups).
 *   --skip-backup        Huwag gumawa ng backup (hindi inirerekomenda).
 *   --verify-only        Ihambing ang bilang ng row sa dalawang database.
 *
 * Ang script ay:
 *   1. gumagawa ng backup ng lokal na .sqlite bago magsulat,
 *   2. gumagawa ng schema sa Turso (CREATE TABLE IF NOT EXISTS — idempotent),
 *   3. nagsusulat ng row sa loob ng ISANG transaction na may
 *      `PRAGMA defer_foreign_keys = ON`, kaya verified pa rin ang FK sa COMMIT,
 *   4. gumagamit ng INSERT OR REPLACE na may orihinal na id (idempotent —
 *      ligtas patakbuhin muli),
 *   5. inihahambing ang bilang ng row at ang mga relasyon pagkatapos.
 *
 * Rollback: huwag burahin ang lokal na .sqlite at ang backup. Kung kailangang
 * bumalik, itakda lamang na wala ang TURSO_DATABASE_URL (o
 * DATABASE_DRIVER=local) — hindi kailanman binabago ng script na ito ang
 * pinagmulang database.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { config } from "../src/config.js";
import { SCHEMA, SPLIT_SCHEMA } from "../src/db/schema.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const verifyOnly = args.includes("--verify-only");
const skipBackup = args.includes("--skip-backup");
const backupFlag = args.find((arg) => arg.startsWith("--backup-dir="));
// Default: server/backups, hindi depende sa CWD (cd server && npm run … ).
const backupDir = backupFlag
  ? path.resolve(backupFlag.split("=")[1])
  : path.resolve(scriptDir, "..", "backups");

// Parehong default sa API: server/data/hasa.sqlite (DATABASE_PATH kung itinakda).
const localPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : config.databasePath;
const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim();

/** Ayos mula sa walang dependency papunta sa may dependency. */
const TABLES = [
  "badges",
  "simplifications",
  "classes",
  "users",
  "sessions",
  "lessons",
  "activities",
  "questions",
  "attempts",
  "attempt_answers",
  "lesson_progress",
  "points_ledger",
  "student_badges",
  "ai_usage",
];

/** Mga column na hindi dapat ilipat nang walang pag-iingat (ITAGO, huwag i-print). */
const BATCH_SIZE = 100;

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function log(message) {
  console.log(message);
}

function backupDatabase() {
  if (!existsSync(localPath)) fail(`Wala ang local database: ${localPath}`);
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(backupDir, `hasa-${stamp}.sqlite`);
  copyFileSync(localPath, target);
  // Kasama ang WAL kung mayroon, para kumpleto ang snapshot.
  for (const suffix of ["-wal", "-shm"]) {
    if (existsSync(localPath + suffix)) copyFileSync(localPath + suffix, target + suffix);
  }
  log(`✔ Backup: ${target} (${(statSync(target).size / 1024).toFixed(1)} KB)`);
  return target;
}

function tableCounts(db) {
  const counts = {};
  for (const table of TABLES) {
    const row = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get();
    counts[table] = Number(row.count);
  }
  return counts;
}

function readTable(db, table) {
  return db.prepare(`SELECT * FROM ${table} ORDER BY rowid`).all();
}

/**
 * Bilang ng row sa Turso. Kapag `tolerant`, ang kulang na table ay itinuturing
 * na 0 sa halip na mag-crash — nangyayari ito sa `--dry-run` at `--verify-only`
 * laban sa isang bagong database na wala pang schema.
 */
async function remoteCounts(client, { tolerant = false } = {}) {
  const counts = {};
  const missing = [];
  for (const table of TABLES) {
    try {
      const result = await client.execute(`SELECT COUNT(*) AS count FROM ${table}`);
      counts[table] = Number(result.rows[0].count);
    } catch (error) {
      if (!tolerant) throw error;
      counts[table] = 0;
      missing.push(table);
    }
  }
  return { counts, missing };
}

async function main() {
  log("HASA → Turso migration");
  log(`  local : ${localPath}`);
  log(`  turso : ${tursoUrl || "(wala)"}`);
  if (dryRun) log("  mode  : DRY RUN — walang isusulat");

  if (!process.env.TURSO_DATABASE_URL) {
    fail("Kailangan ang TURSO_DATABASE_URL. Tingnan ang docs/DEPLOYMENT.md §2.");
  }
  if (!tursoToken && tursoUrl.startsWith("libsql://")) {
    fail("Kailangan ang TURSO_AUTH_TOKEN para sa libsql:// URL.");
  }
  if (!existsSync(localPath)) {
    fail(`Wala ang local database ${localPath}. Ilagay ang tamang DATABASE_PATH.`);
  }

  let backupPath = null;
  if (!dryRun && !verifyOnly && !skipBackup) backupPath = backupDatabase();
  const local = new DatabaseSync(localPath, { readOnly: true });
  const counts = tableCounts(local);
  const totalRows = Object.values(counts).reduce((sum, value) => sum + value, 0);
  log("\nBilang ng row sa lokal na database:");
  for (const [table, count] of Object.entries(counts)) log(`  ${table.padEnd(16)} ${count}`);
  log(`  ${"TOTAL".padEnd(16)} ${totalRows}`);

  const client = createClient({ url: tursoUrl, authToken: tursoToken });

  if (verifyOnly) {
    log("\nInihahambing ang dalawang database…");
    const { counts: remote, missing } = await remoteCounts(client, { tolerant: true });
    if (missing.length === TABLES.length) {
      local.close();
      client.close();
      fail(`Walang schema sa Turso (${tursoUrl}). Patakbuhin muna nang walang --verify-only.`);
    }
    if (missing.length > 0) {
      log(`  (wala pang table sa Turso: ${missing.join(", ")})`);
    }
    let mismatches = 0;
    for (const table of TABLES) {
      const ok = counts[table] === remote[table];
      if (!ok) mismatches += 1;
      log(`  ${ok ? "✔" : "✖"} ${table.padEnd(16)} local=${counts[table]} turso=${remote[table]}`);
    }
    local.close();
    client.close();
    if (mismatches > 0) fail(`${mismatches} table ang hindi tugma.`);
    log("\n✔ Tugma ang lahat ng bilang.");
    return;
  }

  // 1. Schema (idempotent)
  if (!dryRun) {
    for (const statement of SPLIT_SCHEMA) {
      await client.execute({ sql: statement, args: [] });
    }
    log("\n✔ Schema sa Turso (CREATE TABLE IF NOT EXISTS)");
  } else {
    log("\n(dry run) Lilikha ng schema kung wala pa.");
  }

  // 2. Data — isang transaction, deferred FK
  const tx = dryRun ? null : await client.transaction("write");
  let written = 0;
  try {
    if (tx) await tx.execute("PRAGMA defer_foreign_keys = ON");
    for (const table of TABLES) {
      const rows = readTable(local, table);
      if (rows.length === 0) continue;
      const columns = Object.keys(rows[0]);
      const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(", ")})
                   VALUES (${columns.map(() => "?").join(", ")})`;
      for (let index = 0; index < rows.length; index += BATCH_SIZE) {
        const slice = rows.slice(index, index + BATCH_SIZE);
        if (!dryRun) {
          await tx.execute("PRAGMA defer_foreign_keys = ON");
          for (const row of slice) {
            await tx.execute({ sql, args: columns.map((column) => row[column]) });
          }
        }
        written += slice.length;
      }
      log(`  ${dryRun ? "(dry run) " : ""}${table.padEnd(16)} ${rows.length} row`);
    }
    if (tx) await tx.commit();
  } catch (error) {
    if (tx) await tx.rollback().catch(() => {});
    local.close();
    client.close();
    fail(`Nabigo ang pagsulat, ibinalik ang transaksyon: ${error.message}`);
  }

  // 3. Verification — walang maisasagawa sa dry run, wala pang naisulat.
  if (dryRun) {
    local.close();
    client.close();
    log(`\nDRY RUN — ${written} row ang ililipat. Walang isinulat, walang binago.`);
    log("  Sunod (kapag kumbinsido ka na): npm run migrate:to-turso");
    return;
  }

  const verify = await client.execute("SELECT 1 AS ok");
  if (Number(verify.rows[0].ok) !== 1) fail("Walang sagot ang Turso pagkatapos ng migration.");
  const { counts: remote } = await remoteCounts(client);
  let mismatches = 0;
  log("\nPag-verify:");
  for (const table of TABLES) {
    const ok = counts[table] === remote[table];
    if (!ok) mismatches += 1;
    log(`  ${ok ? "✔" : "✖"} ${table.padEnd(16)} local=${counts[table]} turso=${remote[table]}`);
  }

  // Relasyon: bawat mag-aaral ay may klase; bawat iskor ay may may-ari.
  const orphans = await client.execute(
    `SELECT
       (SELECT COUNT(*) FROM users u LEFT JOIN classes c ON c.id = u.class_id
         WHERE u.role = 'student' AND c.id IS NULL) AS students_without_class,
       (SELECT COUNT(*) FROM attempts a LEFT JOIN users u ON u.id = a.student_id
         WHERE u.id IS NULL) AS attempts_without_student,
       (SELECT COUNT(*) FROM points_ledger p LEFT JOIN users u ON u.id = p.student_id
         WHERE u.id IS NULL) AS points_without_student`,
  );
  const relations = orphans.rows[0];
  for (const [key, value] of Object.entries(relations)) {
    const ok = Number(value) === 0;
    if (!ok) mismatches += 1;
    log(`  ${ok ? "✔" : "✖"} ${key}: ${value}`);
  }

  local.close();
  client.close();

  log(`\nNakasulat: ${dryRun ? 0 : written} row`);
  if (backupPath) log(`Backup: ${backupPath}`);
  if (mismatches > 0) {
    fail(`${mismatches} pagsusuri ang hindi pumasa. HUWAG paandarin ang production laban sa Turso.`);
  }
  log("\n✔ Kumpleto at tugma ang migration.");
  log("  Sunod: itakda ang TURSO_DATABASE_URL at TURSO_AUTH_TOKEN sa Render, i-deploy,");
  log("  pagkatapos ay patakbuhin ang `npm run migrate:verify --prefix server`.");
}

await main();
