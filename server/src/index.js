import { createApp } from "./app.js";
import { assertProductionConfig, config } from "./config.js";
import { getDatabase } from "./db/database.js";

async function main() {
  try {
    assertProductionConfig();
    const app = createApp();
    // Sa Turso, remote ang schema + seed: hintayin bago tanggapin ang traffic.
    await getDatabase().ready;
    app.listen(config.port, () => {
      console.log(
        `HASA API listening on http://localhost:${config.port} (db: ${getDatabase().driverName})`,
      );
    });
  } catch (error) {
    console.error("[HASA API] Failed to start:", error.message);
    // Turso ang production database: kung hindi ito maabot, sabihin kaagad
    // kung aling setting ang titingnan — hindi lang "fetch failed".
    if (config.tursoUrl) {
      const host = config.tursoUrl.startsWith("file:")
        ? config.tursoUrl
        : config.tursoUrl.replace(/^(libsql|https?):\/\//, "").replace(/\/.*$/, "");
      console.error(`[HASA API] Turso target: ${host}`);
      const reason = `${error.message} ${error.cause?.code ?? ""} ${error.code ?? ""}`;
      if (!config.tursoAuthToken) {
        console.error(
          "[HASA API] TURSO_AUTH_TOKEN is empty — paste the token from the Turso dashboard into server/.env.",
        );
      } else if (/ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|ECONNREFUSED|UND_ERR|fetch failed|socket/i.test(reason)) {
        console.error(
          "[HASA API] Cannot reach the Turso host — network/firewall first, token second.",
        );
      } else {
        console.error(
          "[HASA API] The host answered but rejected the request: check TURSO_DATABASE_URL / TURSO_AUTH_TOKEN.",
        );
      }
      console.error("[HASA API] Diagnose with: npm run db:check");
    }
    process.exitCode = 1;
  }
}

await main();
