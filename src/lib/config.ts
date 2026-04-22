/**
 * 2M Store - Online Connection Config
 * 
 * This file contains the hardcoded connection string to ensure the system 
 * works online immediately on Vercel.
 */
// We URL-encoded the password because it contains an '@' character which would break the URI format.
export const ONLINE_DB_URL = "postgresql://postgres:Ajx%400100xja@db.gtjxfvpjhbgrwrxmngrb.supabase.co:5432/postgres";
