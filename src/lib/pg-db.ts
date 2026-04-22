import { Pool } from 'pg';

/**
 * Standard PostgreSQL Pool for Cloud Deployment (Vercel + Supabase).
 * This replaces Prisma for core operations to ensure 100% stability.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Neon
  }
});

export const pgQuery = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error', err);
    throw err;
  }
};

export default pool;
