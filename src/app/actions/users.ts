"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    return db.prepare('SELECT * FROM User ORDER BY createdAt DESC').all();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(data: { name: string; username: string; password: string; role: string }) {
  try {
    const id = `u_${Date.now()}`;
    db.prepare('INSERT INTO User (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)').run(
      id, data.name, data.username, data.password, data.role
    );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE')) {
      return { success: false, error: "اسم المستخدم موجود بالفعل!" };
    }
    return { success: false, error: "فشل في إنشاء المستخدم." };
  }
}

export async function updateUser(id: string, data: { name?: string; username?: string; password?: string; role?: string }) {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.username) { fields.push('username = ?'); values.push(data.username); }
    if (data.password) { fields.push('password = ?'); values.push(data.password); }
    if (data.role) { fields.push('role = ?'); values.push(data.role); }
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    db.prepare(`UPDATE User SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل في تحديث بيانات المستخدم." };
  }
}

export async function deleteUser(id: string) {
  try {
    db.prepare('DELETE FROM User WHERE id = ?').run(id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل في حذف المستخدم." };
  }
}
