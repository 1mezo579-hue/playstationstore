import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create all tables
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

  CREATE TABLE IF NOT EXISTS InventoryItem (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    condition TEXT,
    quantity INTEGER DEFAULT 0,
    buyPrice REAL DEFAULT 0,
    sellPrice REAL DEFAULT 0,
    serialNumber TEXT UNIQUE,
    barcode TEXT UNIQUE,
    branchId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS MaintenanceTicket (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branchId INTEGER,
    customerId INTEGER,
    deviceType TEXT NOT NULL,
    issue TEXT NOT NULL,
    cost REAL DEFAULT 0,
    status TEXT DEFAULT 'RECEIVED',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Sale (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branchId INTEGER,
    totalAmount REAL DEFAULT 0,
    tradeInValue REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS SaleItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    saleId INTEGER,
    inventoryItemId TEXT,
    quantity INTEGER DEFAULT 1,
    price REAL DEFAULT 0
  );
`);

// Seed default users if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get() as any;
if (userCount.count === 0) {
  const insert = db.prepare('INSERT INTO User (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)');
  insert.run('u1', 'إسلام (الأونر)', 'admin', '102030', 'OWNER');
  insert.run('u2', 'أحمد الصيانة', 'tech', 'tech123', 'MAINTENANCE');
  insert.run('u3', 'محمد المبيعات', 'sales', 'sales123', 'SELLER');
}

// Seed default branch if empty
const branchCount = db.prepare('SELECT COUNT(*) as count FROM Branch').get() as any;
if (branchCount.count === 0) {
  db.prepare('INSERT INTO Branch (name, location) VALUES (?, ?)').run('الفرع الرئيسي', 'وسط البلد');
}

export { db };
