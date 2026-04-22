"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function ensureBranchExists() {
  // 1. Ensure Branch
  let branch = await prisma.branch.findFirst({
    where: { name: "الفرع الرئيسي" }
  });

  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        name: "الفرع الرئيسي",
        location: "وسط البلد",
      }
    });
  }

  // 2. Seed Users if none exist
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: 'إسلام (الأونر)', username: 'admin', password: '102030', role: 'OWNER' },
        { name: 'مسئول الصيانة', username: 'tech', password: 'tech123', role: 'MAINTENANCE' },
        { name: 'البائع', username: 'sales', password: 'sales123', role: 'SELLER' }
      ]
    });
  }

  return branch;
}

export async function getInventoryItems() {
  try {
    return await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function addInventoryItem(data: {
  name: string;
  category: string;
  condition: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  serialNumber?: string;
  barcode?: string;
}) {
  try {
    const branch = await ensureBranchExists();

    const item = await prisma.inventoryItem.create({
      data: {
        ...data,
        branchId: branch.id,
      }
    });

    revalidatePath("/");
    return { success: true, item };
  } catch (error: any) {
    console.error("Error adding item:", error);
    if (error?.code === 'P2002') {
      return { success: false, error: "هذا السيريال أو الباركود موجود مسبقاً!" };
    }
    return { success: false, error: "حدث خطأ أثناء إضافة الصنف." };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    await prisma.inventoryItem.delete({
      where: { id }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء الحذف." };
  }
}
