"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  try {
    const branches = db.prepare(`
      SELECT b.*,
        (SELECT COUNT(*) FROM InventoryItem WHERE branchId = b.id) as itemCount,
        (SELECT COUNT(*) FROM Sale WHERE branchId = b.id) as saleCount,
        (SELECT COUNT(*) FROM MaintenanceTicket WHERE branchId = b.id) as ticketCount
      FROM Branch b ORDER BY b.id ASC
    `).all();
    return branches;
  } catch (error) {
    return [];
  }
}

export async function createBranch(name: string, location: string) {
  try {
    const result = db.prepare('INSERT INTO Branch (name, location) VALUES (?, ?)').run(name, location);
    revalidatePath("/dashboard");
    return { success: true, branch: { id: result.lastInsertRowid, name, location } };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء إضافة الفرع." };
  }
}
