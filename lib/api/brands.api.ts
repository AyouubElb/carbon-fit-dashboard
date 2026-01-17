import { supabase } from "@/lib/supabase/client";
import { Brand } from "@/lib/types";

export const brandsApi = {
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from("brands")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  },
};
