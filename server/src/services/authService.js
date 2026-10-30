import { config } from "../config.js";
import { getDatabase, transaction } from "../db/database.js";
import { hashSessionToken, randomToken } from "../utils/security.js";
import { nowIso } from "../utils/time.js";

export function publicUser(db, userId) {
  const user = db
    .prepare(
      `SELECT u.id, u.username, u.role, u.display_name, u.reading_level, u.created_at,
              c.id AS class_id, c.name AS class_name, c.join_code,
              t.display_name AS teacher_name
       FROM users u
       LEFT JOIN classes c ON c.id = u.class_id
       LEFT JOIN users t ON t.id = c.teacher_id
       WHERE u.id = ? AND u.is_active = 1`,
    )
    .get(userId);
  if (!user) return null;

  let ownClass = null;
  if (user.role === "teacher") {
    ownClass = db
      .prepare("SELECT id, name, join_code FROM classes WHERE teacher_id = ?")
      .get(userId);
  }

  const cls = ownClass
    ? {
        id: Number(ownClass.id),
        name: ownClass.name,
        joinCode: ownClass.join_code,
        studentCount: Number(
          db
            .prepare("SELECT COUNT(*) AS count FROM users WHERE class_id = ? AND role = 'student' AND is_active = 1")
            .get(ownClass.id).count,
        ),
      }
    : user.class_id
      ? {
          id: Number(user.class_id),
          name: user.class_name,
          joinCode: null,
          teacherName: user.teacher_name,
        }
      : null;

  return {
    id: Number(user.id),
    username: user.username,
    role: user.role,
    displayName: user.display_name,
    readingLevel: user.reading_level,
    createdAt: user.created_at,
    class: cls,
  };
}

export function findUserBySession(token) {
  if (!token) return null;
  const db = getDatabase();
  const tokenHash = hashSessionToken(token);
  const row = db
    .prepare(
      `SELECT u.id, u.is_active, s.expires_at, s.token_hash
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    )
    .get(tokenHash);

  if (!row || !row.is_active) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
    return null;
  }

  return { userId: Number(row.id), tokenHash };
}

export function issueSession(userId) {
  const db = getDatabase();
  const token = randomToken(32);
  const tokenHash = hashSessionToken(token);
  const now = new Date();
  const expires = new Date(now.getTime() + config.sessionDays * 24 * 60 * 60 * 1000);

  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now.toISOString());
  db.prepare(
    "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
  ).run(tokenHash, userId, now.toISOString(), expires.toISOString());

  return { token, tokenHash, expires };
}

export function revokeSession(tokenHash) {
  if (!tokenHash) return;
  getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}

export function revokeOtherSessions(userId, keepTokenHash) {
  const db = getDatabase();
  db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?").run(
    userId,
    keepTokenHash ?? "",
  );
}

export function createTeacher({ username, passwordHash, displayName, className }) {
  return transaction((db) => {
    const now = nowIso();
    const userResult = db
      .prepare(
        `INSERT INTO users (username, password_hash, role, display_name, class_id, reading_level, is_active, created_at)
         VALUES (?, ?, 'teacher', ?, NULL, NULL, 1, ?)`,
      )
      .run(username, passwordHash, displayName, now);
    const teacherId = Number(userResult.lastInsertRowid);

    let joinCode;
    let attempts = 0;
    do {
      joinCode = generateUniqueJoinCode(db);
      attempts += 1;
    } while (!joinCode && attempts < 10);
    if (!joinCode) throw new Error("Could not generate a unique class code.");

    const classResult = db
      .prepare("INSERT INTO classes (name, join_code, teacher_id, created_at) VALUES (?, ?, ?, ?)")
      .run(className, joinCode, teacherId, now);

    return {
      teacherId,
      classId: Number(classResult.lastInsertRowid),
      joinCode,
    };
  });
}

function generateUniqueJoinCode(db) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = randomToken(6).replace(/[^A-Za-z0-9]/g, "");
    let code = "";
    for (let index = 0; index < 6; index += 1) {
      code += alphabet[bytes.charCodeAt(index) % alphabet.length];
    }
    const candidate = `HASA-${code}`;
    const exists = db.prepare("SELECT 1 FROM classes WHERE join_code = ?").get(candidate);
    if (!exists) return candidate;
  }
  return null;
}

export function rotateJoinCode(teacherId) {
  return transaction((db) => {
    const cls = db.prepare("SELECT id FROM classes WHERE teacher_id = ?").get(teacherId);
    if (!cls) return null;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const code = generateUniqueJoinCode(db);
      if (!code) continue;
      db.prepare("UPDATE classes SET join_code = ? WHERE id = ?").run(code, cls.id);
      return code;
    }
    return null;
  });
}
