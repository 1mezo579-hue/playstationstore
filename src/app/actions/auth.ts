"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Super Robust Auth Action for Online Deployment
 * Handles auto-initialization of the database if empty.
 */
export async function authenticateAdmin(username: string, password?: string) {
  // 1. MASTER BYPASS (Hardcoded for maximum reliability online)
  if (username === "admin" && password === "102030") {
    try {
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("user_data", JSON.stringify({ 
        id: 'master', 
        name: 'إسلام (الأونر)', 
        role: 'OWNER' 
      }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
      
      // OPTIONAL: Try to auto-seed in the background if master logs in
      // This ensures the DB gets populated eventually
      autoSeedIfEmpty().catch(console.error);
      
      return { success: true };
    } catch (e) {
      console.error("Critical: Cookie set failed", e);
    }
  }

  try {
    // 2. Database Login
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (user && user.password === password) {
      const cookieStore = await cookies();
      const cookieData = JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role
      });

      cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("user_data", cookieData, { path: "/", maxAge: 60 * 60 * 24 * 7 });
      return { success: true };
    }
    
    return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة!" };
  } catch (error) {
    console.error("Database Auth Failed:", error);
    
    // Last resort: if DB fails, allow the master login anyway
    if (username === "admin" && password === "102030") return { success: true };
    
    return { success: false, error: "فشل الاتصال بقاعدة البيانات السحابية. تأكد من إعدادات Vercel." };
  }
}

/**
 * Background helper to seed the online DB if it's new
 */
async function autoSeedIfEmpty() {
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      console.log("DB is empty, auto-seeding default users...");
      await prisma.user.createMany({
        data: [
          { name: 'إسلام (الأونر)', username: 'admin', password: '102030', role: 'OWNER' },
          { name: 'أحمد الصيانة', username: 'tech', password: 'tech123', role: 'MAINTENANCE' },
          { name: 'محمد المبيعات', username: 'sales', password: 'sales123', role: 'SELLER' }
        ]
      });
    }
  } catch (e) {
    // Silently fail if table doesn't exist yet - user needs to run prisma db push
    console.error("Auto-seed skipped: User table might not exist yet.");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_data", "", { path: "/", maxAge: 0 });
}
