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
    process.exitCode = 1;
  }
}

await main();
