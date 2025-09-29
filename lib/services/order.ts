import { supabase } from "../supabase/client";
import { Profile } from "../types";

export async function getOrders(profile?: Profile | null) {
  if (profile && profile.is_admin === false) {
    throw new Error("Forbidden: not an admin");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function editOrder(
  id: string,
  updates: Record<string, any>,
  profile?: Profile | null
) {
  // client-side guard (UX only)
  if (profile && profile.is_admin === false) {
    throw new Error("Forbidden: you must be an admin to edit orders");
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
