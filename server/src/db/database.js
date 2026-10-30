import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "../config.js";
import { seedBadges, seedCurriculum } from "./seedContent.js";

let database = null;

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  join_code TEXT NOT NULL UNIQUE COLLATE NOCASE,
  teacher_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  display_name TEXT NOT NULL,
  class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL,
  reading_level TEXT CHECK (reading_level IN ('independent', 'instructional', 'frustration')),
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  CHECK (
    (role = 'student' AND class_id IS NOT NULL AND reading_level IS NOT NULL)
    OR (role = 'teacher' AND class_id IS NULL AND reading_level IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'katamtaman'
    CHECK (difficulty IN ('madali', 'katamtaman', 'mahirap')),
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  xp INTEGER NOT NULL DEFAULT 15,
  content_independent TEXT NOT NULL,
  content_instructional TEXT NOT NULL,
  content_frustration TEXT NOT NULL,
  vocabulary_json TEXT NOT NULL DEFAULT '[]',
  published INTEGER NOT NULL DEFAULT 1,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lessons_class ON lessons(class_id, published);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('activity', 'quiz')),
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL,
  xp INTEGER NOT NULL DEFAULT 25,
  pass_percent INTEGER NOT NULL DEFAULT 60,
  timer_seconds INTEGER,
  published INTEGER NOT NULL DEFAULT 1,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activities_class ON activities(class_id, kind, published);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  options_json TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_questions_activity ON questions(activity_id, position);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  score INTEGER,
  total INTEGER NOT NULL,
  timed_out INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_attempts_activity ON attempts(activity_id, status);

CREATE TABLE IF NOT EXISTS attempt_answers (
  attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed')),
  completed_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS points_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason_code TEXT NOT NULL,
  ref_type TEXT,
  ref_id INTEGER,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_points_once
  ON points_ledger(student_id, reason_code, ref_type, ref_id);
CREATE INDEX IF NOT EXISTS idx_points_student ON points_ledger(student_id, created_at);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name_tl TEXT NOT NULL,
  description_tl TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  criteria_type TEXT NOT NULL,
  criteria_target INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS student_badges (
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TEXT NOT NULL,
  PRIMARY KEY (student_id, badge_id)
);

CREATE TABLE IF NOT EXISTS simplifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cache_key TEXT NOT NULL UNIQUE,
  reading_level TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  operation TEXT NOT NULL,
  input_chars INTEGER NOT NULL DEFAULT 0,
  output_chars INTEGER NOT NULL DEFAULT 0,
  succeeded INTEGER NOT NULL,
  error_code TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_student ON ai_usage(student_id, created_at);
`;

export function initDatabase({ seed = true } = {}) {
  if (database) return database;

  if (config.databasePath !== ":memory:") {
    mkdirSync(path.dirname(config.databasePath), { recursive: true });
  }

  database = new DatabaseSync(config.databasePath);
  database.exec("PRAGMA foreign_keys = ON;");
  if (config.databasePath !== ":memory:") {
    database.exec("PRAGMA journal_mode = WAL;");
  }
  database.exec(SCHEMA);

  seedBadges(database);
  if (seed) seedCurriculum(database);

  return database;
}

export function getDatabase() {
  if (!database) return initDatabase();
  return database;
}

export function transaction(work) {
  const db = getDatabase();
  db.exec("BEGIN IMMEDIATE;");
  try {
    const result = work(db);
    db.exec("COMMIT;");
    return result;
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
}

export function closeDatabase() {
  if (database) {
    database.close();
    database = null;
  }
}
