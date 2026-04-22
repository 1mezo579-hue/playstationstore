"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ensureBranchExists } from "./inventory";

export async function getMaintenanceTickets() {
  try {
    return await prisma.maintenanceTicket.findMany({
      include: {
        customer: true,
        partsUsed: {
          include: {
            inventoryItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching maintenance tickets:", error);
    return [];
  }
}

export async function createMaintenanceTicket(data: {
  customerName: string;
  customerPhone: string;
  deviceType: string;
  issue: string;
  estimatedCost?: number;
}) {
  try {
    const branch = await ensureBranchExists();

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { phone: data.customerPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          phone: data.customerPhone
        }
      });
    }

    const ticket = await prisma.maintenanceTicket.create({
      data: {
        branchId: branch.id,
        customerId: customer.id,
        deviceType: data.deviceType,
        issue: data.issue,
        cost: data.estimatedCost || 0,
        status: "RECEIVED"
      }
    });

    revalidatePath("/");
    return { success: true, ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "حدث خطأ أثناء إنشاء تذكرة الصيانة." };
  }
}

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    await prisma.maintenanceTicket.update({
      where: { id: ticketId },
      data: { status }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء تحديث الحالة." };
  }
}
