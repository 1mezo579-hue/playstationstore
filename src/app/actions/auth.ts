"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function authenticateAdmin(username: string, password?: string) {
  try {
    // 1. Master Bypass (Always works, even without DB)
    if (username === "admin" && password === "102030") {
       const cookieStore = await cookies();
       cookieStore.set("admin_auth", "true", { path: "/", maxAge: 60 * 60 * 24 * 7 });
       cookieStore.set("user_data", JSON.stringify({ 
         id: 'master', 
         name: 'إسلام (الأونر)', 
         role: 'OWNER' 
       }), { path: "/", maxAge: 60 * 60 * 24 * 7 });
       return { success: true };
    }

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
    console.error("Online Login error:", error);
    return { success: false, error: "حدث خطأ في الاتصال بالسيرفر." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "", { path: "/", maxAge: 0 });
  cookieStore.set("user_data", "", { path: "/", maxAge: 0 });
}
