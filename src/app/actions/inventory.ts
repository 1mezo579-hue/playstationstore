"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function ensureBranchExists() {
  // 1. Ensure Branch
  let { data: branch, error } = await supabase
    .from('Branch')
    .select('*')
    .eq('name', 'الفرع الرئيسي')
    .single();

  if (error || !branch) {
    const { data: newBranch, error: createError } = await supabase
      .from('Branch')
      .insert([{ name: 'الفرع الرئيسي', location: 'وسط البلد' }])
      .select()
      .single();
    
    if (createError) throw createError;
    branch = newBranch;
  }

  return branch;
}

export async function getInventoryItems() {
  try {
    const { data, error } = await supabase
      .from('InventoryItem')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching inventory (SDK):", error);
    return [];
  }
}

export async function addInventoryItem(data: any) {
  try {
    const branch = await ensureBranchExists();
    const id = `item_${Date.now()}`;

    const { error } = await supabase
      .from('InventoryItem')
      .insert([{ 
        ...data, 
        id,
        branchId: branch?.id || 1 
      }]);

    if (error) throw error;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding item (SDK):", error);
    return { success: false, error: "حدث خطأ أثناء إضافة الصنف." };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const { error } = await supabase
      .from('InventoryItem')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء الحذف." };
  }
}
