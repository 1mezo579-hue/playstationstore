"use server";

import { Pool } from 'pg';
import { ONLINE_DB_URL } from '../lib/config';

/**
 * Setup Action with ULTIMATE SSL BYPASS.
 * This is specifically designed to fix the 'self-signed certificate' error.
 */
export async function setupOnlineDatabase() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || ONLINE_DB_URL;

  if (!connectionString || connectionString.includes("ضع_الرابط_هنا")) {
    return { success: false, error: "رابط قاعدة البيانات غير موجود." };
  }

  // Create a one-time pool with aggressive SSL bypassing
  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // This bypasses the certificate chain error
    }
  });

  try {
    console.log("Starting Online Setup with SSL Bypass...");
    const client = await pool.connect();
    
    try {
      // 1. Create Tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "username" TEXT UNIQUE NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT DEFAULT 'SELLER',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Add Users
      await client.query(`
        INSERT INTO "User" (id, name, username, password, role)
        VALUES 
        ('u1', 'إسلام (الأونر)', 'admin', '102030', 'OWNER'),
        ('u2', 'أحمد الصيانة', 'tech', 'tech123', 'MAINTENANCE'),
        ('u3', 'محمد المبيعات', 'sales', 'sales123', 'SELLER')
        ON CONFLICT (username) DO NOTHING;
      `);

      return { success: true, message: "تم التفعيل بنجاح! قاعدة البيانات جاهزة الآن." };
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Setup failed (SSL Bypass Mode):", error);
    return { success: false, error: "فشل التفعيل: " + (error.message || "خطأ في الشهادة") };
  } finally {
    await pool.end();
  }
}
