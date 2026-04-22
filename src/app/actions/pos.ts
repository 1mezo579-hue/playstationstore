"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPOSItems() {
  try {
    return db.prepare('SELECT * FROM InventoryItem WHERE quantity > 0 ORDER BY name ASC').all();
  } catch (error) {
    return [];
  }
}

export async function processSale(data: {
  branchId: number;
  items: { id: string; quantity: number; price: number }[];
  totalAmount: number;
  tradeInAmount?: number;
}) {
  try {
    const transaction = db.transaction(() => {
      // 1. Create sale
      const saleResult = db.prepare('INSERT INTO Sale (branchId, totalAmount, tradeInValue) VALUES (?, ?, ?)').run(
        data.branchId || 1, data.totalAmount, data.tradeInAmount || 0
      );

      // 2. Create sale items and update inventory
      for (const item of data.items) {
        db.prepare('INSERT INTO SaleItem (saleId, inventoryItemId, quantity, price) VALUES (?, ?, ?, ?)').run(
          saleResult.lastInsertRowid, item.id, item.quantity, item.price
        );
        db.prepare('UPDATE InventoryItem SET quantity = quantity - ? WHERE id = ?').run(item.quantity, item.id);
      }

      return saleResult.lastInsertRowid;
    });

    const saleId = transaction();
    revalidatePath("/dashboard");
    return { success: true, saleId };
  } catch (error) {
    return { success: false, error: "فشلت عملية البيع، يرجى المحاولة مرة أخرى." };
  }
}
