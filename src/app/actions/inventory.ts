"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  try {
    return db.prepare('SELECT * FROM InventoryItem ORDER BY createdAt DESC').all();
  } catch (error) {
    return [];
  }
}

export async function addInventoryItem(data: any) {
  try {
    const id = `item_${Date.now()}`;
    db.prepare(`
      INSERT INTO InventoryItem (id, name, category, condition, quantity, buyPrice, sellPrice, serialNumber, barcode, branchId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.name, data.category, data.condition, data.quantity, data.buyPrice, data.sellPrice, data.serialNumber || null, data.barcode || null, 1);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('UNIQUE')) {
      return { success: false, error: "هذا السيريال أو الباركود موجود مسبقاً!" };
    }
    return { success: false, error: "حدث خطأ أثناء إضافة الصنف." };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    db.prepare('DELETE FROM InventoryItem WHERE id = ?').run(id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء الحذف." };
  }
}
