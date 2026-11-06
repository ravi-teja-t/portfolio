import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DB_PATH = path.join(process.cwd(), "data", "portfolio.db");

// Stored on globalThis so dev hot reloads reuse one connection.
const globalForDb = globalThis as typeof globalThis & { db?: DatabaseSync };

// Opened on first use so that importing this module during `next build`
// doesn't create the database file.
export function getDb(): DatabaseSync {
  if (!globalForDb.db) {
    mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL");
    globalForDb.db = db;
  }
  return globalForDb.db;
}
