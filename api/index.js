import { createApp } from "../server/src/app.js";
import {
  demoProvisioningEnabled,
  ensureDemoAccounts,
} from "../server/src/services/demoAccounts.js";

const app = createApp();

let provisioning;

function ensureReady() {
  if (!demoProvisioningEnabled()) return Promise.resolve(null);
  if (!provisioning) {
    provisioning = ensureDemoAccounts().catch((error) => {
      provisioning = undefined;
      throw error;
    });
  }
  return provisioning;
}

export default async function handler(req, res) {
  try {
    await ensureReady();
  } catch (error) {
    console.error("Demo account provisioning failed:", error.message);
  }
  return app(req, res);
}
