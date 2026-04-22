import { Pool } from 'pg';
import { ONLINE_DB_URL } from './config';

/**
 * Standard PostgreSQL Pool for Cloud Deployment.
 * Uses environment variable first, then falls back to the hardcoded URL in config.ts.
 */
const connectionString = process.env.DATABASE_URL || ONLINE_DB_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export const pgQuery = async (text: string, params?: any[]) => {
  if (!connectionString || connectionString.includes("ضع_الرابط_هنا")) {
    throw new Error("رابط قاعدة البيانات غير موجود. يرجى وضعه في ملف src/lib/config.ts");
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Query error', err);
    throw err;
  }
};

export default pool;
