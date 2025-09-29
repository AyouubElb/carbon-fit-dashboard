import { supabase } from "../supabase/client";
import { createClient } from "@supabase/supabase-js";
import { ProductPayload } from "../types";
import { supabaseAdmin } from "../supabase/server";

interface Brand {
  name: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  onSale: boolean;
  brands: Brand;
  images: string[];
  description: string;
  sizes: string[];
  stock: number;
  stockStatus: "In stock" | "Low stock" | "Out of stock";
  created_at?: string | Date;
}

interface SupabaseProductRow {
  id?: unknown;
  title?: unknown;
  price?: unknown;
  originalPrice?: unknown;
  onSale?: unknown;
  images?: unknown;
  description?: unknown;
  brands?:
    | { id: unknown; name: unknown }
    | { id: unknown; name: unknown }[]
    | unknown;
  sizes?: unknown;
  stock?: unknown;
  stockStatus?: unknown;
  created_at?: unknown;
  [key: string]: unknown;
}

// helper to compute fallback status from stock
function computeStockStatusFromNumber(
  stockNum: number
): Product["stockStatus"] {
  if (stockNum <= 0) return "Out of stock";
  if (stockNum >= 50) return "In stock";
  return "Low stock";
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, price, originalPrice, onSale, images, description, brands(name), sizes, stock, stockStatus, created_at"
    );

  if (error) throw error;
  if (!data) return [];

  const rows = data as SupabaseProductRow[];

  const products = rows.map<Product>((row) => {
    // pick first brand if array, or use object / fallback
    const rawBrand = Array.isArray(row.brands)
      ? row.brands[0]
      : (row.brands as { name: unknown } | undefined);

    const stockNum = Number(row.stock ?? 0);

    const rawStatus = row.stockStatus;
    let status: Product["stockStatus"];

    if (typeof rawStatus === "string") {
      const s = rawStatus.trim();
      if (s === "In stock" || s === "Low stock" || s === "Out of stock") {
        status = s as Product["stockStatus"];
      } else {
        status = computeStockStatusFromNumber(stockNum);
      }
    } else {
      status = computeStockStatusFromNumber(stockNum);
    }

    return {
      id: String(row.id ?? ""),
      title: String(row.title ?? ""),
      price: Number(row.price ?? 0),
      originalPrice:
        row.originalPrice !== undefined && row.originalPrice !== null
          ? Number(row.originalPrice)
          : undefined,
      onSale: Boolean(row.onSale),
      images: Array.isArray(row.images) ? row.images.map(String) : [],
      description: String(row.description ?? ""),
      brands: { name: String((rawBrand?.name ?? "") as unknown) },
      sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
      stock: stockNum,
      stockStatus: status,
      created_at: row.created_at ? String(row.created_at) : undefined,
    };
  });

  return products;
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, price, originalPrice, stock, onSale, images, description, brands(id, name), sizes, created_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as SupabaseProductRow;

  // Normalize brand: if row.brands is an array pick first item, otherwise use object, fallback to empty name
  let brandObj = { id: "", name: "" };

  if (Array.isArray(row.brands) && row.brands.length > 0) {
    const brand = row.brands[0] as { id?: string; name?: unknown };
    brandObj = {
      id: brand.id ?? "",
      name: String(brand.name ?? ""),
    };
  } else if (row.brands && typeof row.brands === "object") {
    const brand = row.brands as { id?: string; name?: unknown };
    brandObj = {
      id: brand.id ?? "",
      name: String(brand.name ?? ""),
    };
  }

  const stock = Number(row.stock ?? 0);

  const stockStatus: "In stock" | "Low stock" | "Out of stock" =
    stock <= 0 ? "Out of stock" : stock <= 5 ? "Low stock" : "In stock";

  const product: Product = {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    price: Number(row.price ?? 0),
    originalPrice:
      row.originalPrice !== undefined && row.originalPrice !== null
        ? Number(row.originalPrice)
        : undefined,
    onSale: Boolean(row.onSale),
    images: Array.isArray(row.images)
      ? (row.images as unknown[]).map(String)
      : [],
    description: String(row.description ?? ""),
    brands: brandObj, // normalized to single object
    sizes: Array.isArray(row.sizes) ? (row.sizes as unknown[]).map(String) : [],
    stock,
    stockStatus,
    created_at: row.created_at ? String(row.created_at) : undefined,
  };

  return product;
};

// server side: updateProduct(id, payload, oldImages?)
export const updateProduct = async (id: string, payload: ProductPayload) => {
  if (!id) throw new Error("Missing product id");

  const updatePayload: Partial<ProductPayload> = {
    title: payload.title,
    description: payload.description ?? null,
    price: payload.price,
    originalPrice: payload.originalPrice,
    onSale: payload.onSale ?? false,
    stock: payload.stock ?? 0,
    sizes: payload.sizes ?? [],
    brand_id: payload.brand_id,
    images: payload.images ?? [],
  };

  // Do update and SELECT (no .single()) so we can inspect return
  const debug = await supabaseAdmin
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select(); // returns { data: [...], error: {...} }

  console.log("update debug result:", debug);

  if (debug.error) {
    // real DB error (column does not exist, etc.)
    throw new Error(debug.error.message);
  }

  if (!debug.data || debug.data.length === 0) {
    // Most likely RLS blocked the update or the row was filtered out
    throw new Error(
      "Update returned no rows. Possible causes: RLS policy blocked the update for this actor, or the row does not exist."
    );
  }

  // Return the first (and expected only) updated row
  return debug.data[0];
};

export const createProduct = async (payload: ProductPayload) => {
  try {
    const brandName = payload.brand_name?.trim() || null;
    let brand_id = payload.brand_id ?? null;

    if (!brand_id && brandName) {
      // Option A: use upsert with onConflict (recommended) — requires a UNIQUE constraint on brands.name
      // This performs insert-or-no-op and returns the row (avoid race conditions)

      const { data: brandUpserted, error: upsertError } = await supabaseAdmin
        .from("brands")
        .upsert({ name: brandName }, { onConflict: "name" })
        .select("id")
        .maybeSingle();

      if (upsertError) {
        // If upsert is not supported or fails for some reason, fall back to find-or-insert below
        console.warn(
          "brands upsert failed, will fallback to find/insert:",
          upsertError.message
        );
      } else if (brandUpserted) {
        brand_id = (brandUpserted as any).id;
      }
    }

    // 1b) Fallback: try to find brand by name (case-insensitive) and insert if not found
    /*if (!brand_id && brandName) {
      // Try to find existing brand
      const { data: foundBrands, error: findError } = await supabaseAdmin
        .from("brands")
        // .ilike provides case-insensitive pattern matching; use exact match pattern
        .select("id")
        .ilike("name", brandName)
        .limit(1);

      if (findError) {
        console.error("Error finding brand:", findError.message);
        throw new Error("Failed to lookup brand");
      }

      if (foundBrands && foundBrands.length > 0) {
        brand_id = foundBrands[0].id;
      } else {
        // Not found -> create brand
        const { data: insertedBrand, error: insertError } = await supabaseAdmin
          .from("brands")
          .insert({ name: brandName })
          .select("id")
          .limit(1)
          .maybeSingle();

        if (insertError) {
          // If duplicate unique constraint happens due to race, re-query to get the id
          console.warn(
            "Insert brand error (attempting re-query):",
            insertError.message
          );
          const { data: reQuery, error: reQueryError } = await supabaseAdmin
            .from("brands")
            .select("id")
            .ilike("name", brandName)
            .limit(1);

          if (reQueryError || !reQuery || reQuery.length === 0) {
            console.error(
              "Failed to resolve brand after insert failure:",
              reQueryError?.message ?? insertError.message
            );
            throw new Error("Failed to create or resolve brand");
          }
          brand_id = reQuery[0].id;
        } else if (insertedBrand) {
          brand_id = (insertedBrand as any).id;
        }
      }
    }*/

    // 2) Build product payload with resolved brand_id
    const newProductPayload: Partial<ProductPayload> = {
      title: payload.title,
      description: payload.description ?? null,
      price: payload.price,
      originalPrice: payload.originalPrice,
      onSale: payload.onSale ?? false,
      stock: payload.stock ?? 0,
      sizes: payload.sizes ?? [],
      brand_id: brand_id ?? null, // set resolved brand id (or null)
      images: payload.images ?? [],
    };

    // 3) Insert product
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(newProductPayload)
      .select(); // return the inserted rows

    if (error) {
      console.error("Error inserting product:", error.message);
      throw new Error(error.message);
    }

    return data ?? null;
  } catch (err: unknown) {
    console.error("createProduct error:", err);
    // rethrow or return null depending on how you want to handle it
    throw err instanceof Error
      ? err
      : new Error("Unknown error creating product");
  }
};
