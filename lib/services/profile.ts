// lib/services/profile.ts
import { supabase } from "@/lib/supabase/client";

export async function fetchProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

/** Fetch the current logged-in user's profile (returns null if no user) */
export async function fetchCurrentProfile() {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userData?.user;
  if (!user) return null;
  return fetchProfileById(user.id);
}
