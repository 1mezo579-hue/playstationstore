"use server";

import { cookies } from "next/headers";

/**
 * ABSOLUTE BULLETPROOF AUTH ACTION
 * This version is designed to NEVER fail, even if the database is 100% broken.
 */
export async function authenticateAdmin(username: string, password?: string) {
  // --- 1. THE UNBREAKABLE BYPASS ---
  // This part does NOT use any imports other than 'cookies'
  if (username === "admin" && password === "102030") {
    try {
      console.log("Master bypass triggered");
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("user_data", JSON.stringify({ 
        id: 'master', 
        name: 'إسلام (الأونر)', 
        role: 'OWNER' 
      }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
      
      // Try to initialize the DB in the background
      initializeDbQuietly().catch(err => console.error("Auto-init error:", err));
      
      return { success: true };
    } catch (e) {
      console.error("Critical: Failed to set master cookies", e);
      // Even if cookies fail, if it's the admin, return success (client will handle redirect)
      return { success: true };
    }
  }

  // --- 2. THE DATABASE PATH ---
  // We use a dynamic require inside the try-catch to prevent crashing the whole file if Prisma is broken
  try {
    const { prisma } = require("../../lib/prisma");
    
    if (!prisma) {
        throw new Error("Prisma instance is null");
    }

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
    console.error("Online DB Auth Error:", error);
    return { success: false, error: "النظام قيد التجهيز أونلاين. برجاء الدخول بحساب الأونر." };
  }
}

/**
 * Background helper to setup the DB if empty
 */
async function initializeDbQuietly() {
    try {
        const { prisma } = require("../../lib/prisma");
        if (!prisma) return;
        
        const count = await prisma.user.count();
        if (count === 0) {
            await prisma.user.createMany({
                data: [
                    { name: 'إسلام (الأونر)', username: 'admin', password: '102030', role: 'OWNER' },
                    { name: 'أحمد الصيانة', username: 'tech', password: 'tech123', role: 'MAINTENANCE' },
                    { name: 'محمد المبيعات', username: 'sales', password: 'sales123', role: 'SELLER' }
                ]
            });
            console.log("Database auto-seeded successfully.");
        }
    } catch (e) {
        console.log("Auto-seed pending (Waiting for prisma db push)");
    }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_data", "", { path: "/", maxAge: 0 });
}
