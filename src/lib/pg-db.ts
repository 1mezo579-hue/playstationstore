import { Pool } from 'pg';
import { ONLINE_DB_URL } from './config';

/**
 * Super Adaptive Database Pool.
 * Priority: 
 * 1. Vercel Postgres (POSTGRES_URL) - The easiest one-click setup.
 * 2. Manual DATABASE_URL.
 * 3. Hardcoded Config URL.
 */
const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  ONLINE_DB_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

export const pgQuery = async (text: string, params?: any[]) => {
  if (!connectionString || connectionString.includes("ضع_الرابط_هنا")) {
    throw new Error("قاعدة البيانات غير مربوطة. يرجى الضغط على زر Connect في تبويب Storage في Vercel.");
  }

  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err: any) {
    console.error('Query error', err);
    throw err;
  }
};
