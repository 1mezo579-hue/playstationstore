"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  try {
    const { data, error } = await supabase
      .from('Branch')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching branches (SDK):", error);
    return [];
  }
}

export async function createBranch(name: string, location: string) {
  try {
    const { data, error } = await supabase
      .from('Branch')
      .insert([{ name, location }])
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard");
    return { success: true, branch: data };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء إضافة الفرع." };
  }
}
