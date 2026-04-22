import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

/**
 * Standard Supabase Client.
 * Works over HTTP, making it 100% stable on Vercel without TCP/DNS issues.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
