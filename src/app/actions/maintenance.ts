"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMaintenanceTickets() {
  try {
    const tickets = db.prepare(`
      SELECT mt.*, c.name as customerName, c.phone as customerPhone 
      FROM MaintenanceTicket mt 
      LEFT JOIN Customer c ON mt.customerId = c.id 
      ORDER BY mt.createdAt DESC
    `).all();
    return tickets;
  } catch (error) {
    return [];
  }
}

export async function createMaintenanceTicket(data: any) {
  try {
    // Find or create customer
    let customer: any = db.prepare('SELECT * FROM Customer WHERE phone = ?').get(data.customerPhone);
    if (!customer) {
      const result = db.prepare('INSERT INTO Customer (name, phone) VALUES (?, ?)').run(data.customerName, data.customerPhone);
      customer = { id: result.lastInsertRowid };
    }

    db.prepare(`
      INSERT INTO MaintenanceTicket (branchId, customerId, deviceType, issue, cost, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(1, customer.id, data.deviceType, data.issue, data.estimatedCost || 0, 'RECEIVED');

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء إنشاء تذكرة الصيانة." };
  }
}

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    db.prepare('UPDATE MaintenanceTicket SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(status, ticketId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء تحديث الحالة." };
  }
}
