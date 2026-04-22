"use server";

import { pgQuery } from "@/lib/pg-db";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const res = await pgQuery('SELECT * FROM "User" ORDER BY "createdAt" DESC');
    return res.rows;
  } catch (error) {
    console.error("Error fetching users (PG):", error);
    return [];
  }
}

export async function createUser(data: any) {
  try {
    const id = `u_${Date.now()}`;
    await pgQuery(
      'INSERT INTO "User" (id, name, username, password, role) VALUES ($1, $2, $3, $4, $5)',
      [id, data.name, data.username, data.password, data.role]
    );
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating user (PG):", error);
    return { success: false, error: "فشل في إنشاء المستخدم." };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.name) { fields.push(`"name" = $${idx++}`); values.push(data.name); }
    if (data.username) { fields.push(`"username" = $${idx++}`); values.push(data.username); }
    if (data.password) { fields.push(`"password" = $${idx++}`); values.push(data.password); }
    if (data.role) { fields.push(`"role" = $${idx++}`); values.push(data.role); }

    values.push(id);
    await pgQuery(
      `UPDATE "User" SET ${fields.join(', ')}, "updatedAt" = NOW() WHERE id = $${idx}`,
      values
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating user (PG):", error);
    return { success: false, error: "فشل في تحديث بيانات المستخدم." };
  }
}

export async function deleteUser(id: string) {
  try {
    await pgQuery('DELETE FROM "User" WHERE id = $1', [id]);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user (PG):", error);
    return { success: false, error: "فشل في حذف المستخدم." };
  }
}
