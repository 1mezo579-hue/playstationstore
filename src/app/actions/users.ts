"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    revalidatePath("/");
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(data: any) {
  try {
    const user = await prisma.user.create({
      data,
    });
    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "فشل في إنشاء المستخدم. ربما اسم المستخدم موجود بالفعل." };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "فشل في تحديث بيانات المستخدم." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "فشل في حذف المستخدم." };
  }
}
