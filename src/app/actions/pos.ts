"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPOSItems() {
  try {
    // Only fetch items that are in stock
    return await prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching POS items:", error);
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
    // Start a transaction to create sale and update inventory
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the sale record
      const sale = await tx.sale.create({
        data: {
          branchId,
          totalAmount,
          tradeInValue: tradeInAmount,
          // discount: 0
        }
      });

      // 2. Create Sale Items and update inventory
      for (const item of items) {
        // Create SaleItem
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            inventoryItemId: item.id,
            quantity: item.quantity,
            price: item.price
          }
        });

        // Update Inventory Quantity
        await tx.inventoryItem.update({
          where: { id: item.id },
          data: {
            quantity: { decrement: item.quantity }
          }
        });
      }

      return sale;
    });

    revalidatePath("/");
    return { success: true, saleId: result.id };
  } catch (error) {
    console.error("Sale processing error:", error);
    return { success: false, error: "فشلت عملية البيع، يرجى المحاولة مرة أخرى." };
  }
}
