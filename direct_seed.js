const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const db = new Database(dbPath);

function seed() {
  console.log('Seeding users directly into SQLite...');
  
  // Clear existing users to avoid unique constraint errors
  db.prepare('DELETE FROM User').run();
  
  const insert = db.prepare(`
    INSERT INTO User (id, name, username, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  const users = [
    {
      id: 'user_owner_1',
      name: 'إسلام (الأونر)',
      username: 'admin',
      password: '102030',
      role: 'OWNER'
    },
    {
      id: 'user_tech_1',
      name: 'أحمد الصيانة',
      username: 'tech',
      password: 'tech123',
      role: 'MAINTENANCE'
    },
    {
      id: 'user_sales_1',
      name: 'محمد المبيعات',
      username: 'sales',
      password: 'sales123',
      role: 'SELLER'
    },
    {
      id: 'user_manager_1',
      name: 'محمود المدير',
      username: 'manager',
      password: 'manager123',
      role: 'MANAGER'
    },
    {
      id: 'user_sales_2',
      name: 'كريم بائع',
      username: 'sales2',
      password: 'sales123',
      role: 'SELLER'
    }
  ];

  for (const user of users) {
    insert.run(user.id, user.name, user.username, user.password, user.role, now, now);
    console.log(`Created user: ${user.username}`);
  }

  console.log('Seeding complete!');
}

try {
  seed();
} catch (err) {
  console.error('Error seeding users:', err);
} finally {
  db.close();
}
