import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@libsql/client";
import { config } from "../config.js";
import { SCHEMA, splitStatements } from "./schema.js";
import { seedBadges, seedCurriculum } from "./seedContent.js";

/*
 * Isang manipis na async na patong sa ibabaw ng dalawang driver:
 *
 *   local  — node:sqlite (DatabaseSync) para sa dev at tests
 *   turso  — @libsql/client (remote libSQL/SQLite sa Turso Cloud)
 *
 * Bakit async ang buong API: ang Turso ay remote, kaya walang tulay sa
 * synchronous na `DatabaseSync`. Pinapanatili namin ang hugis ng lumang code
 * (`db.prepare(sql).get(...)`) pero ang bawat tawag ay Promise na.
 *
 *   const row = await db.prepare("SELECT ...").get(id);
 *   await db.prepare("INSERT ...").run(a, b);
 *   await db.transaction(async (tx) => { ... });
 */

/** `stmt.get(a, b)` at `stmt.get([a, b])` ay parehong tinatanggap. */
function normaliseArgs(args) {
  return args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
}

/** Hatiin ang schema sa magkakahiwalay na statement para sa remote driver. */

/** Lokal na SQLite (node:sqlite). Ang default para sa dev at automated tests. */
class LocalDriver {
  name = "local";

  constructor(file) {
    if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
    this.file = file;
    this.db = new DatabaseSync(file);
    this.statements = new Map();
  }

  prepare(sql) {
    let statement = this.statements.get(sql);
    if (!statement) {
      statement = this.db.prepare(sql);
      this.statements.set(sql, statement);
    }
    return statement;
  }

  async get(sql, args) {
    return this.prepare(sql).get(...args) ?? null;
  }

  async all(sql, args) {
    return this.prepare(sql).all(...args);
  }

  async run(sql, args) {
    const info = this.prepare(sql).run(...args);
    return {
      changes: Number(info.changes ?? 0),
      lastInsertRowid: Number(info.lastInsertRowid ?? 0),
    };
  }

  async exec(sql) {
    this.db.exec(sql);
  }

  async begin() {
    this.db.exec("BEGIN IMMEDIATE;");
    let settled = false;
    return {
      get: (sql, args) => this.get(sql, args),
      all: (sql, args) => this.all(sql, args),
      run: (sql, args) => this.run(sql, args),
      exec: (sql) => this.exec(sql),
      commit: async () => {
        if (settled) return;
        settled = true;
        this.db.exec("COMMIT;");
      },
      rollback: async () => {
        if (settled) return;
        settled = true;
        this.db.exec("ROLLBACK;");
      },
    };
  }

  async close() {
    this.statements.clear();
    this.db.close();
  }
}

/** Turso Cloud (@libsql/client). Ginagamit kapag may TURSO_DATABASE_URL. */
class TursoDriver {
  name = "turso";

  constructor({ url, authToken }) {
    this.client = createClient({ url, authToken });
  }

  #rows(result) {
    const columns = result.columns;
    return result.rows.map((row) => {
      const plain = {};
      columns.forEach((column, index) => {
        plain[column] = row[index];
      });
      return plain;
    });
  }

  #meta(result) {
    return {
      changes: Number(result.rowsAffected ?? 0),
      lastInsertRowid: Number(result.lastInsertRowid ?? 0),
    };
  }

  async get(sql, args) {
    const result = await this.client.execute({ sql, args });
    return this.#rows(result)[0] ?? null;
  }

  async all(sql, args) {
    const result = await this.client.execute({ sql, args });
    return this.#rows(result);
  }

  async run(sql, args) {
    return this.#meta(await this.client.execute({ sql, args }));
  }

  async exec(sql) {
    const statements = splitStatements(sql);
    if (statements.length === 0) return;
    // Isang round trip: batch na "write" — bumabalik lamang kapag tapos lahat.
    await this.client.batch(
      statements.map((statement) => ({ sql: statement, args: [] })),
      "write",
    );
  }

  async begin() {
    const tx = await this.client.transaction("write");
    let settled = false;
    return {
      get: async (sql, args) => this.#rows(await tx.execute({ sql, args }))[0] ?? null,
      all: async (sql, args) => this.#rows(await tx.execute({ sql, args })),
      run: async (sql, args) => this.#meta(await tx.execute({ sql, args })),
      exec: async (sql) => {
        for (const statement of splitStatements(sql)) {
          await tx.execute({ sql: statement, args: [] });
        }
      },
      commit: async () => {
        if (settled) return;
        settled = true;
        await tx.commit();
      },
      rollback: async () => {
        if (settled) return;
        settled = true;
        await tx.rollback();
      },
    };
  }

  async close() {
    this.client.close();
  }
}

class Database {
  constructor(driver) {
    this.driver = driver;
    this.driverName = driver.name;
    this.initialising = false;
    this.ready = Promise.resolve();
  }

  /** Bumabalik agad sa isang statement object; ang mga tawag ang async. */
  prepare(sql) {
    const driver = this.driver;
    return {
      get: (...args) => this.#guard(() => driver.get(sql, normaliseArgs(args))),
      all: (...args) => this.#guard(() => driver.all(sql, normaliseArgs(args))),
      run: (...args) => this.#guard(() => driver.run(sql, normaliseArgs(args))),
    };
  }

  exec(sql) {
    return this.#guard(() => this.driver.exec(sql));
  }

  async #guard(fn) {
    if (!this.initialising) await this.ready;
    return fn();
  }

  async transaction(work) {
    await this.ready;
    const handle = await this.driver.begin();
    const tx = {
      prepare: (sql) => ({
        get: (...args) => handle.get(sql, normaliseArgs(args)),
        all: (...args) => handle.all(sql, normaliseArgs(args)),
        run: (...args) => handle.run(sql, normaliseArgs(args)),
      }),
      exec: (sql) => handle.exec(sql),
    };
    try {
      const result = await work(tx);
      await handle.commit();
      return result;
    } catch (error) {
      await handle.rollback();
      throw error;
    }
  }

  async close() {
    await this.driver.close();
  }
}

let database = null;

/** Buuin ang driver base sa environment. Turso kapag may URL, kung hindi local. */
export function createDriver() {
  if (config.tursoUrl) {
    return new TursoDriver({ url: config.tursoUrl, authToken: config.tursoAuthToken });
  }
  const file = config.databasePath;
  const driver = new LocalDriver(file);
  driver.db.exec("PRAGMA foreign_keys = ON;");
  if (file !== ":memory:") driver.db.exec("PRAGMA journal_mode = WAL;");
  return driver;
}

export function initDatabase({ seed = true } = {}) {
  if (database) return database;

  const db = new Database(createDriver());
  database = db;
  db.initialising = true;
  db.ready = (async () => {
    try {
      await db.driver.exec(SCHEMA);
      await seedBadges(db);
      if (seed) await seedCurriculum(db);
    } finally {
      db.initialising = false;
    }
  })();
  return db;
}

export function getDatabase() {
  if (!database) return initDatabase();
  return database;
}

export async function transaction(work) {
  return getDatabase().transaction(work);
}

export async function closeDatabase() {
  if (database) {
    const closing = database;
    database = null;
    await closing.ready.catch(() => {});
    await closing.close();
  }
}
