"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getPOSItems() {
  try {
    const { data, error } = await supabase
      .from('InventoryItem')
      .select('*')
      .gt('quantity', 0)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching POS items (SDK):", error);
    return [];
  }
}

export async function processSale({
  branchId,
  items,
  totalAmount,
  tradeInAmount = 0,
}: {
  branchId: number;
  items: { id: string; quantity: number; price: number }[];
  totalAmount: number;
  tradeInAmount?: number;
}) {
  try {
    // 1. Create Sale Record
    const { data: sale, error: saleError } = await supabase
      .from('Sale')
      .insert([{
        branchId: branchId || 1,
        totalAmount,
        tradeInValue: tradeInAmount
      }])
      .select()
      .single();

    if (saleError) throw saleError;

    // 2. Process items
    for (const item of items) {
      // Create SaleItem
      await supabase
        .from('SaleItem')
        .insert([{
          saleId: sale.id,
          inventoryItemId: item.id,
          quantity: item.quantity,
          price: item.price
        }]);

      // Update Inventory Quantity (Manual decrement)
      const { data: currentItem } = await supabase
        .from('InventoryItem')
        .select('quantity')
        .eq('id', item.id)
        .single();
      
      if (currentItem) {
        await supabase
          .from('InventoryItem')
          .update({ quantity: currentItem.quantity - item.quantity })
          .eq('id', item.id);
      }
    }

    revalidatePath("/dashboard");
    return { success: true, saleId: sale.id };
  } catch (error) {
    console.error("Sale processing error (SDK):", error);
    return { success: false, error: "فشلت عملية البيع، يرجى المحاولة مرة أخرى." };
  }
}
