// lib/services/profile.ts
import { supabase } from "@/lib/supabase/client";

export async function fetchProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile by ID:", error);
    throw error;
  }

  return data;
}

/** Fetch the current logged-in user's profile (returns null if no user) */
export async function fetchCurrentProfile() {
  try {
    const { data: userData, error: userErr } = await supabase.auth.getUser();

    if (userErr) {
      console.error("Error fetching user:", userErr);
      throw userErr;
    }

    const user = userData?.user;
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }

    return await fetchProfileById(user.id);
  } catch (error) {
    console.error("Error in fetchCurrentProfile:", error);
    // Re-throw so AuthProvider can handle it
    throw error;
  }
}
