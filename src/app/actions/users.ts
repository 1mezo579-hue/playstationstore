"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users (SDK):", error);
    return [];
  }
}

export async function createUser(data: any) {
  try {
    const { error } = await supabase
      .from('User')
      .insert([{ ...data, id: `u_${Date.now()}` }]);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating user (SDK):", error);
    return { success: false, error: "فشل في إنشاء المستخدم." };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const { error } = await supabase
      .from('User')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating user (SDK):", error);
    return { success: false, error: "فشل في تحديث بيانات المستخدم." };
  }
}

export async function deleteUser(id: string) {
  try {
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user (SDK):", error);
    return { success: false, error: "فشل في حذف المستخدم." };
  }
}
