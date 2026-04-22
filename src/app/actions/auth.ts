"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function authenticateAdmin(username: string, password?: string) {
  // 1. Master bypass - always works
  if (username === "admin" && password === "102030") {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("user_data", JSON.stringify({ id: 'master', name: 'إسلام (الأونر)', role: 'OWNER' }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return { success: true };
  }

  // 2. Database login
  try {
    const user: any = db.prepare('SELECT * FROM User WHERE username = ?').get(username);
    if (user && user.password === password) {
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("user_data", JSON.stringify({ id: user.id, name: user.name, role: user.role }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
      return { success: true };
    }
    return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة!" };
  } catch (error) {
    console.error("Auth error:", error);
    return { success: false, error: "حدث خطأ في قاعدة البيانات." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_data", "", { path: "/", maxAge: 0 });
}
