"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  try {
    return await prisma.branch.findMany({
      include: {
        _count: {
          select: { items: true, sales: true, tickets: true }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
}

export async function createBranch(name: string, location: string) {
  try {
    const branch = await prisma.branch.create({
      data: { name, location }
    });
    revalidatePath("/");
    return { success: true, branch };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء إضافة الفرع." };
  }
}
