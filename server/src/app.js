import express from "express";
import path from "node:path";
import { existsSync } from "node:fs";
import { config } from "./config.js";
import { optionalAuth } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { cors, verifyOrigin } from "./middleware/security.js";
import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/student.js";
import { teacherRouter } from "./routes/teacher.js";
import { aiFeatureStatus } from "./services/aiService.js";
import { getDatabase } from "./db/database.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(express.json({ limit: "1mb" }));
  app.use(cors);
  app.use(verifyOrigin);
  app.use(optionalAuth);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/config", (_req, res) => {
    res.json({
      appName: "HASA",
      schoolYear: "2026–2027",
      gradeLevel: 8,
      subject: "Araling Panlipunan",
      ai: aiFeatureStatus(),
      teacherRegistrationEnabled: Boolean(config.teacherSignupCode),
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/student", studentRouter);
  app.use("/api/teacher", teacherRouter);

  // In production the API can also serve the built SPA when both live on
  // one persistent host. On Vercel the static client is served separately.
  const clientDist = path.resolve(config.serverRoot, "..", "client", "dist");
  if (config.isProduction && existsSync(clientDist)) {
    app.use(express.static(clientDist, { index: false, maxAge: "1h" }));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  // Fail fast on the first request if the database cannot be opened.
  getDatabase();

  return app;
}
