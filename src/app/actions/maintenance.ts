"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { ensureBranchExists } from "./inventory";

export async function getMaintenanceTickets() {
  try {
    const { data, error } = await supabase
      .from('MaintenanceTicket')
      .select('*, customer:Customer(*)')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching maintenance tickets (SDK):", error);
    return [];
  }
}

export async function createMaintenanceTicket(data: any) {
  try {
    const branch = await ensureBranchExists();

    // 1. Find or create customer
    let { data: customer, error: customerError } = await supabase
      .from('Customer')
      .select('*')
      .eq('phone', data.customerPhone)
      .single();

    if (customerError || !customer) {
      const { data: newCustomer, error: createCustError } = await supabase
        .from('Customer')
        .insert([{ name: data.customerName, phone: data.customerPhone }])
        .select()
        .single();
      
      if (createCustError) throw createCustError;
      customer = newCustomer;
    }

    // 2. Create ticket
    const { error: ticketError } = await supabase
      .from('MaintenanceTicket')
      .insert([{
        branchId: branch?.id || 1,
        customerId: customer?.id,
        deviceType: data.deviceType,
        issue: data.issue,
        cost: data.estimatedCost || 0,
        status: "RECEIVED"
      }]);

    if (ticketError) throw ticketError;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error creating ticket (SDK):", error);
    return { success: false, error: "حدث خطأ أثناء إنشاء تذكرة الصيانة." };
  }
}

export async function updateTicketStatus(ticketId: number, status: string) {
  try {
    const { error } = await supabase
      .from('MaintenanceTicket')
      .update({ status })
      .eq('id', ticketId);

    if (error) throw error;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "حدث خطأ أثناء تحديث الحالة." };
  }
}
