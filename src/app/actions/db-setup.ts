"use server";

import { pgQuery } from "@/lib/pg-db";
import { revalidatePath } from "next/cache";

/**
 * The NEW "Magic" Setup Action using raw 'pg'.
 * This is 100% stable on Vercel and bypasses all Prisma engine issues.
 */
export async function setupOnlineDatabase() {
  try {
    console.log("Starting Online Database Setup (Raw PG)...");

    // 1. Create User table
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "username" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT DEFAULT 'SELLER',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Branch table
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS "Branch" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "location" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Add Default Users if missing
    const res = await pgQuery('SELECT COUNT(*) FROM "User"');
    const userCount = parseInt(res.rows[0].count);
    
    if (userCount === 0) {
      await pgQuery(`
        INSERT INTO "User" (id, name, username, password, role)
        VALUES 
        ('u1', 'إسلام (الأونر)', 'admin', '102030', 'OWNER'),
        ('u2', 'أحمد الصيانة', 'tech', 'tech123', 'MAINTENANCE'),
        ('u3', 'محمد المبيعات', 'sales', 'sales123', 'SELLER')
      `);
    }

    revalidatePath("/");
    return { success: true, message: "تم تفعيل قاعدة البيانات أونلاين بنجاح باستخدام المحرك السريع!" };
  } catch (error: any) {
    console.error("Setup failed (PG):", error);
    return { success: false, error: "فشل التفعيل: " + (error.message || "خطأ في السيرفر") };
  }
}
