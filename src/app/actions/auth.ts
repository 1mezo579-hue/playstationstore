"use server";

import { cookies } from "next/headers";
import { pgQuery } from "@/lib/pg-db";

export async function authenticateAdmin(username: string, password?: string) {
  // 1. MASTER BYPASS (Hardcoded for maximum reliability)
  if (username === "admin" && password === "102030") {
    try {
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("user_data", JSON.stringify({ id: 'master', name: 'إسلام (الأونر)', role: 'OWNER' }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
      return { success: true };
    } catch (e) {
      return { success: true }; // Still let them in
    }
  }

  try {
    // 2. Database Login using raw PG
    const res = await pgQuery('SELECT * FROM "User" WHERE username = $1', [username]);
    const user = res.rows[0];

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
    console.error("Auth error (PG):", error);
    return { success: false, error: "النظام قيد التحديث أونلاين. جرب حساب الأونر." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_data", "", { path: "/", maxAge: 0 });
}
