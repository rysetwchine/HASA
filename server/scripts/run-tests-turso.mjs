#!/usr/bin/env node
/**
 * Patakbuhin ang buong test suite laban sa `@libsql/client` driver — parehong
 * code path ng Turso — gamit ang lokal na `file:` database (walang cloud
 * credentials na kailangan).
 *
 *   npm run test:turso --prefix server
 *
 * Ito ang pinakamalapit na paraan para mapatunayang gumagana ang async/Turso
 * na driver nang hindi gumagamit ng tunay na Turso account.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const dir = mkdtempSync(path.join(tmpdir(), "hasa-turso-test-"));
const file = path.join(dir, "test.db");

const child = spawn(
  process.execPath,
  ["--test", "--test-reporter=spec", "test/api.test.js"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      TURSO_DATABASE_URL: `file:${file}`,
      TURSO_AUTH_TOKEN: "",
    },
  },
);

child.on("exit", (code) => {
  rmSync(dir, { recursive: true, force: true });
  process.exit(code ?? 1);
});
