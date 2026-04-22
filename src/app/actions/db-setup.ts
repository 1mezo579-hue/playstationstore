"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * The "Magic" Setup Action.
 * Creates all tables and default users directly from the web interface.
 */
export async function setupOnlineDatabase() {
  try {
    console.log("Starting Online Database Setup...");

    // 1. Create User table using raw SQL (Safe for PostgreSQL/Supabase)
    await prisma.$executeRawUnsafe(`
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
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Branch" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "location" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Add Default Users if missing
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.createMany({
        data: [
          { id: 'u1', name: 'إسلام (الأونر)', username: 'admin', password: '102030', role: 'OWNER' },
          { id: 'u2', name: 'أحمد الصيانة', username: 'tech', password: 'tech123', role: 'MAINTENANCE' },
          { id: 'u3', name: 'محمد المبيعات', username: 'sales', password: 'sales123', role: 'SELLER' }
        ]
      });
    }

    revalidatePath("/");
    return { success: true, message: "تم تفعيل قاعدة البيانات أونلاين بنجاح!" };
  } catch (error: any) {
    console.error("Setup failed:", error);
    return { success: false, error: "فشل التفعيل: " + error.message };
  }
}
