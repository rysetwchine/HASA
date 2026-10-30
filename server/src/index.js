import { createApp } from "./app.js";
import { assertProductionConfig, config } from "./config.js";

try {
  assertProductionConfig();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`HASA API listening on http://localhost:${config.port}`);
  });
} catch (error) {
  console.error("[HASA API] Failed to start:", error.message);
  process.exitCode = 1;
}
