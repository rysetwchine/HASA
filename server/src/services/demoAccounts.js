import { getDatabase } from "../db/database.js";
import { createTeacher } from "./authService.js";
import { hashPassword } from "../utils/security.js";
import { nowIso } from "../utils/time.js";

/**
 * Canonical demo accounts. They are ordinary accounts with a known password and
 * no seeded progress. They are created only when the demo provisioning script
 * runs; the rest of the application never fabricates accounts.
 *
 * Set DEMO_PASSWORD in the environment for anything beyond local development.
 */
export const DEMO_ACCOUNTS = Object.freeze({
  teacher: {
    username: "guro_demo",
    password: process.env.DEMO_PASSWORD || "HasaDemo2024!",
    displayName: "Gurong Demo",
    className: "Klaseng Demo",
  },
  student: {
    username: "estudyante_demo",
    password: process.env.DEMO_PASSWORD || "HasaDemo2024!",
    displayName: "Estudyanteng Demo",
    readingLevel: "instructional",
  },
});

export function demoProvisioningEnabled() {
  return Boolean(process.env.DEMO_PASSWORD) || process.env.NODE_ENV !== "production";
}

export async function ensureDemoAccounts() {
  if (!demoProvisioningEnabled()) return null;

  const db = getDatabase();
  const teacherPasswordHash = await hashPassword(DEMO_ACCOUNTS.teacher.password);
  const studentPasswordHash = await hashPassword(DEMO_ACCOUNTS.student.password);

  let teacher = db
    .prepare("SELECT id FROM users WHERE username = ? AND role = 'teacher'")
    .get(DEMO_ACCOUNTS.teacher.username);
  let cls = teacher
    ? db.prepare("SELECT id, name, join_code FROM classes WHERE teacher_id = ?").get(teacher.id)
    : null;

  if (teacher && cls) {
    db.prepare("UPDATE users SET password_hash = ?, is_active = 1 WHERE id = ?").run(
      teacherPasswordHash,
      teacher.id,
    );
  } else if (teacher && !cls) {
    throw new Error(
      `Teacher "${DEMO_ACCOUNTS.teacher.username}" exists but has no class.`,
    );
  } else {
    const created = createTeacher({
      username: DEMO_ACCOUNTS.teacher.username,
      passwordHash: teacherPasswordHash,
      displayName: DEMO_ACCOUNTS.teacher.displayName,
      className: DEMO_ACCOUNTS.teacher.className,
    });
    teacher = { id: created.teacherId };
    cls = db
      .prepare("SELECT id, name, join_code FROM classes WHERE teacher_id = ?")
      .get(created.teacherId);
  }

  let student = db
    .prepare("SELECT id FROM users WHERE username = ? AND role = 'student'")
    .get(DEMO_ACCOUNTS.student.username);
  if (student) {
    db.prepare(
      `UPDATE users
       SET password_hash = ?, role = 'student', class_id = ?, reading_level = ?, is_active = 1
       WHERE id = ?`,
    ).run(
      studentPasswordHash,
      cls.id,
      DEMO_ACCOUNTS.student.readingLevel,
      student.id,
    );
  } else {
    db.prepare(
      `INSERT INTO users (username, password_hash, role, display_name, class_id, reading_level, is_active, created_at)
       VALUES (?, ?, 'student', ?, ?, ?, 1, ?)`,
    ).run(
      DEMO_ACCOUNTS.student.username,
      studentPasswordHash,
      DEMO_ACCOUNTS.student.displayName,
      cls.id,
      DEMO_ACCOUNTS.student.readingLevel,
      nowIso(),
    );
    student = db
      .prepare("SELECT id FROM users WHERE username = ? AND role = 'student'")
      .get(DEMO_ACCOUNTS.student.username);
  }

  const demoIds = [teacher.id, student?.id].filter(Boolean);
  if (demoIds.length > 0) {
    db.prepare(
      `DELETE FROM sessions WHERE user_id IN (${demoIds.map(() => "?").join(", ")})`,
    ).run(...demoIds);
  }

  return { teacherId: teacher.id, studentId: student?.id, classId: cls.id };
}

export function demoAvailability(db = getDatabase()) {
  const rows = db
    .prepare(
      `SELECT role FROM users
       WHERE is_active = 1
         AND ((role = 'teacher' AND username = ?) OR (role = 'student' AND username = ?))`,
    )
    .all(DEMO_ACCOUNTS.teacher.username, DEMO_ACCOUNTS.student.username);
  const roles = new Set(rows.map((row) => row.role));
  return {
    student: roles.has("student"),
    teacher: roles.has("teacher"),
  };
}
