import { supabase } from "../supabase/client";
import { Order } from "../types";

// lib/api/orders.api.ts
export const ordersApi = {
  async getOrders(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
  }): Promise<{ orders: Order[]; total: number }> {
    let query = supabase.from("orders").select(`*`, { count: "exact" });

    // Server-side filtering
    if (params.status && params.status !== "All") {
      query = query.eq("status", params.status);
    }

    if (params.search) {
      query = query.or(
        `full_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
      );
    }

    // Server-side pagination
    const from = ((params.page || 1) - 1) * (params.pageSize || 10);
    const to = from + (params.pageSize || 10) - 1;
    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return { orders: data || [], total: count || 0 };
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
