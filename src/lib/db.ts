import Database from 'better-sqlite3';
import path from 'path';

// Absolute path to the database for reliability on Windows
const dbPath = path.resolve(process.cwd(), 'dev.db');

export const db = new Database(dbPath, {
  // verbose: console.log 
});

// Helper to ensure tables exist if someone deletes the DB file
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'SELLER',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS Branch (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initDb();
