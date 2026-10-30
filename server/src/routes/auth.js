import { Router } from "express";
import { config } from "../config.js";
import { getDatabase } from "../db/database.js";
import {
  clearSessionCookie,
  requireAuth,
  sessionTokenFromRequest,
  setSessionCookie,
} from "../middleware/auth.js";
import { rateLimit } from "../middleware/security.js";
import {
  createTeacher,
  issueSession,
  publicUser,
  revokeOtherSessions,
  revokeSession,
} from "../services/authService.js";
import { getPoints, getStreak } from "../services/progressService.js";
import { AppError, errors } from "../utils/errors.js";
import { hashPassword, hashSessionToken, verifyPassword } from "../utils/security.js";
import { levelForPoints, nowIso } from "../utils/time.js";
import * as validate from "../utils/validation.js";

export const authRouter = Router();

async function studentStats(userId) {
  const db = getDatabase();
  const points = (await getPoints(db, userId));
  return {
    points,
    level: levelForPoints(points),
    streak: (await getStreak(db, userId)),
  };
}

export async function sessionPayload(user) {
  const payload = { user };
  if (user.role === "student") payload.stats = await studentStats(user.id);
  return payload;
}

authRouter.post(
  "/register/student",
  rateLimit({ keyPrefix: "register", windowMs: 60 * 60 * 1000, max: 30 }),
  async (req, res, next) => {
    try {
      const username = validate.username(req.body?.username);
      const password = validate.password(req.body?.password);
      const displayName = validate.text(req.body?.displayName, "palayaw", {
        min: 2,
        max: 60,
      });
      const code = validate.joinCode(req.body?.classCode);
      const readingLevel = validate.readingLevel(req.body?.readingLevel ?? "instructional");

      const db = getDatabase();
      const existing = (await db.prepare("SELECT id FROM users WHERE username = ?").get(username));
      if (existing) {
        throw errors.conflict("Ginagamit na ang username na ito. Pumili ng iba.");
      }

      const cls = (await db.prepare("SELECT id FROM classes WHERE join_code = ?").get(code));
      if (!cls) {
        throw errors.validation(
          "Hindi mahanap ang kodigo ng klase. Tiyakin itong tama at humingi ng tulong sa guro.",
        );
      }

      const passwordHash = await hashPassword(password);
      const result = (await db
        .prepare(
          `INSERT INTO users (username, password_hash, role, display_name, class_id, reading_level, is_active, created_at)
           VALUES (?, ?, 'student', ?, ?, ?, 1, ?)`,
        )
        .run(username, passwordHash, displayName, cls.id, readingLevel, nowIso()));

      const session = (await issueSession(Number(result.lastInsertRowid)));
      setSessionCookie(res, session.token);
      const user = (await publicUser(db, Number(result.lastInsertRowid)));
      res.status(201).json(await sessionPayload(user));
    } catch (error) {
      if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return next(errors.conflict("Ginagamit na ang username na ito. Pumili ng iba."));
      }
      next(error);
    }
  },
);

authRouter.post(
  "/register/teacher",
  rateLimit({ keyPrefix: "register-teacher", windowMs: 60 * 60 * 1000, max: 20 }),
  async (req, res, next) => {
    try {
      if (!config.teacherSignupCode) {
        throw new AppError(
          403,
          "TEACHER_SIGNUP_DISABLED",
          "Hindi pa bukas ang pagpaparehistro ng guro. Hilingin sa administrador ng paaralan na gumawa ng account.",
        );
      }

      const schoolCode = validate.text(req.body?.schoolCode, "kodigo ng paaralan", {
        min: 6,
        max: 80,
      });
      if (schoolCode !== config.teacherSignupCode) {
        throw errors.forbidden("Mali ang kodigo ng paaralan para sa mga guro.");
      }

      const username = validate.username(req.body?.username);
      const password = validate.password(req.body?.password);
      const displayName = validate.text(req.body?.displayName, "pangalan ng guro", {
        min: 2,
        max: 60,
      });
      const className = validate.text(req.body?.className, "pangalan ng klase", {
        min: 3,
        max: 80,
      });

      const db = getDatabase();
      const existing = (await db.prepare("SELECT id FROM users WHERE username = ?").get(username));
      if (existing) {
        throw errors.conflict("Ginagamit na ang username na ito. Pumili ng iba.");
      }

      const passwordHash = await hashPassword(password);
      const created = (await createTeacher({
        username,
        passwordHash,
        displayName,
        className,
      }));
      const session = (await issueSession(created.teacherId));
      setSessionCookie(res, session.token);
      const user = (await publicUser(db, created.teacherId));
      res.status(201).json({ ...(await sessionPayload(user)), classJoinCode: created.joinCode });
    } catch (error) {
      if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return next(errors.conflict("Ginagamit na ang username na ito. Pumili ng iba."));
      }
      next(error);
    }
  },
);

authRouter.post(
  "/login",
  rateLimit({ keyPrefix: "login", windowMs: 15 * 60 * 1000, max: 12 }),
  async (req, res, next) => {
    try {
      const usernameValue =
        typeof req.body?.username === "string" ? req.body.username.trim() : "";
      const passwordValue =
        typeof req.body?.password === "string" ? req.body.password : "";

      if (!usernameValue || !passwordValue) {
        throw errors.validation("Ilagay ang username at password.");
      }

      const db = getDatabase();
      const account = (await db
        .prepare(
          "SELECT id, password_hash, is_active FROM users WHERE username = ?",
        )
        .get(usernameValue));

      const passwordOk = account
        ? await verifyPassword(passwordValue, account.password_hash)
        : false;

      if (!account || !passwordOk || !account.is_active) {
        throw new AppError(
          401,
          "INVALID_CREDENTIALS",
          "Mali ang username o password. Subukan muli.",
        );
      }

      const session = (await issueSession(Number(account.id)));
      setSessionCookie(res, session.token);
      const user = (await publicUser(db, Number(account.id)));
      res.json(await sessionPayload(user));
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post("/logout", async (req, res) => {
  const token = sessionTokenFromRequest(req);
  if (token) (await revokeSession(hashSessionToken(token)));
  clearSessionCookie(res);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  res.json(await sessionPayload(req.user));
});

authRouter.patch("/profile", requireAuth, async (req, res, next) => {
  try {
    const db = getDatabase();
    const displayName = validate.text(req.body?.displayName, "pangalan", {
      min: 2,
      max: 60,
    });

    if (req.user.role === "student") {
      const readingLevel = validate.readingLevel(req.body?.readingLevel);
      (await db.prepare("UPDATE users SET display_name = ?, reading_level = ? WHERE id = ?").run(
        displayName,
        readingLevel,
        req.user.id,
      ));
    } else {
      (await db.prepare("UPDATE users SET display_name = ? WHERE id = ?").run(
        displayName,
        req.user.id,
      ));
      if (req.body?.className !== undefined) {
        const className = validate.text(req.body.className, "pangalan ng klase", {
          min: 3,
          max: 80,
        });
        (await db.prepare("UPDATE classes SET name = ? WHERE teacher_id = ?").run(
          className,
          req.user.id,
        ));
      }
    }

    res.json(await sessionPayload(await publicUser(db, req.user.id)));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/password", requireAuth, async (req, res, next) => {  try {
    const currentPassword =
      typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
    const newPassword = validate.password(req.body?.newPassword, "bagong password");
    if (!currentPassword) {
      throw errors.validation("Ilagay ang kasalukuyang password.");
    }

    const db = getDatabase();
    const account = (await db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(req.user.id));
    const ok = await verifyPassword(currentPassword, account?.password_hash);
    if (!ok) throw errors.validation("Mali ang kasalukuyang password.");

    const newHash = await hashPassword(newPassword);
    (await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      newHash,
      req.user.id,
    ));
    (await revokeOtherSessions(req.user.id, req.auth?.tokenHash));
    res.json({ message: "Napalitan na ang password." });
  } catch (error) {
    next(error);
  }
});
