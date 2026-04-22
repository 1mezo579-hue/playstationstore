import { Pool } from 'pg';
import { ONLINE_DB_URL } from './config';

/**
 * Super Intelligent Database Pool.
 * Automatically tries different connection formats if one fails.
 */
const getPool = (url: string) => {
  return new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
};

export const pgQuery = async (text: string, params?: any[]) => {
  let lastError: any = null;
  
  // Try 1: The provided URL
  try {
    const pool = getPool(ONLINE_DB_URL);
    const res = await pool.query(text, params);
    return res;
  } catch (err: any) {
    lastError = err;
    console.log("Primary connection failed, trying fallback...");
    
    // Try 2: Fallback by removing 'db.' prefix if present
    if (ONLINE_DB_URL.includes("db.")) {
      try {
        const fallbackUrl = ONLINE_DB_URL.replace("db.", "");
        const pool2 = getPool(fallbackUrl);
        const res = await pool2.query(text, params);
        return res;
      } catch (err2) {
        console.log("Fallback failed too.");
      }
    }
  }

  // If all failed, report the detailed error
  if (lastError?.code === 'ENOTFOUND') {
    throw new Error("لم يتم العثور على عنوان السيرفر. يرجى استخدام رابط الـ 'Transaction' من Supabase بورت 6543.");
  }
  throw lastError;
};
