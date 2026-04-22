import { Pool } from 'pg';
import { ONLINE_DB_URL } from './config';

const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  ONLINE_DB_URL;

// Process environment to allow self-signed certificates globally for this process
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
});

export const pgQuery = async (text: string, params?: any[]) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err: any) {
    console.error('Query error (with SSL Bypass)', err);
    throw err;
  }
};

export default pool;
