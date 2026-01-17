import { supabase } from "@/lib/supabase/client";
import { Brand, Product } from "@/lib/types";

// Raw Supabase row type from database query
interface ProductRow {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  onSale: boolean;
  images: string[];
  description: string;
  brands: { id: string; name: string } | { id: string; name: string }[];
  sizes: string[];
  stock: number;
  stockStatus?: string;
  created_at?: string;
}

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  stockStatus?: string;
}

export const productsApi = {
  async getProducts(params: GetProductsParams = {}): Promise<Product[]> {
    const { page = 1, pageSize = 6, stockStatus } = params;

    // Build base query
    let query = supabase
      .from("products")
      .select(
        "id, title, price, originalPrice, onSale, images, description, brands(id, name), sizes, stock, stockStatus, created_at"
      );

    // Apply stock status filter
    if (stockStatus && stockStatus !== "All") {
      query = query.eq("stockStatus", stockStatus);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;
    if (!data) return [];

    // Normalize the data
    return data.map((row: ProductRow) => {
      const rawBrand = Array.isArray(row.brands) ? row.brands[0] : row.brands;
      const stock = Number(row.stock ?? 0);

      // Calculate stock status if not provided
      let stockStatus: "In stock" | "Low stock" | "Out of stock";
      if (
        row.stockStatus &&
        ["In stock", "Low stock", "Out of stock"].includes(row.stockStatus)
      ) {
        stockStatus = row.stockStatus as
          | "In stock"
          | "Low stock"
          | "Out of stock";
      } else {
        stockStatus =
          stock <= 0 ? "Out of stock" : stock <= 10 ? "Low stock" : "In stock";
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
        brands: {
          id: String(rawBrand?.id ?? ""),
          name: String(rawBrand?.name ?? ""),
        },
        sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
        stock,
        stockStatus,
        created_at: row.created_at ? String(row.created_at) : undefined,
      };
    });
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, title, price, originalPrice, onSale, images, description, brands(id, name), sizes, stock, created_at"
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error.message);
      return null;
    }
    if (!data) return null;

    const row = data as ProductRow;
    let brandObj = { id: "", name: "" };

    if (Array.isArray(row.brands)) {
      const brand = row.brands[0] as Brand;
      brandObj =
        row.brands.length > 0
          ? { id: String(brand?.id ?? ""), name: String(brand?.name ?? "") }
          : brandObj;
    } else if (row.brands && typeof row.brands === "object") {
      const brand = row.brands as Brand;
      brandObj = {
        id: String(brand?.id ?? ""),
        name: String(brand?.name ?? ""),
      };
    }

    const stock = Number(row.stock ?? 0);

    // Calculate stock status if not provided
    let stockStatus: "In stock" | "Low stock" | "Out of stock";
    if (
      row.stockStatus &&
      ["In stock", "Low stock", "Out of stock"].includes(row.stockStatus)
    ) {
      stockStatus = row.stockStatus as
        | "In stock"
        | "Low stock"
        | "Out of stock";
    } else {
      stockStatus =
        stock <= 0 ? "Out of stock" : stock <= 10 ? "Low stock" : "In stock";
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
      brands: brandObj,
      sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
      stock,
      stockStatus,
      created_at: row.created_at ? String(row.created_at) : undefined,
    };
  },

  async createProduct(payload: {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    onSale: boolean;
    stock: number;
    sizes: string[];
    brand_id: string | null;
    images: string[];
  }): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert({
        title: payload.title,
        description: payload.description,
        price: payload.price,
        originalPrice: payload.originalPrice,
        onSale: payload.onSale,
        stock: payload.stock,
        sizes: payload.sizes,
        brand_id: payload.brand_id,
        images: payload.images,
      })
      .select(
        "id, title, price, originalPrice, onSale, images, description, brands(id, name), sizes, stock, stockStatus, created_at"
      )
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Failed to create product");

    const row = data as ProductRow;
    const rawBrand = Array.isArray(row.brands) ? row.brands[0] : row.brands;
    const stock = Number(row.stock ?? 0);

    const stockStatus: "In stock" | "Low stock" | "Out of stock" =
      stock <= 0 ? "Out of stock" : stock <= 10 ? "Low stock" : "In stock";

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
      brands: {
        id: String(rawBrand?.id ?? ""),
        name: String(rawBrand?.name ?? ""),
      },
      sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
      stock,
      stockStatus,
      created_at: row.created_at ? String(row.created_at) : undefined,
    };
  },

  async updateProduct(
    id: string,
    payload: {
      title?: string;
      description?: string;
      price?: number;
      originalPrice?: number;
      onSale?: boolean;
      stock?: number;
      sizes?: string[];
      brand_id?: string | null;
      images?: string[];
    }
  ): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select(
        "id, title, price, originalPrice, onSale, images, description, brands(id, name), sizes, stock, stockStatus, created_at"
      )
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Failed to update product");

    const row = data as ProductRow;
    const rawBrand = Array.isArray(row.brands) ? row.brands[0] : row.brands;
    const stock = Number(row.stock ?? 0);

    const stockStatus: "In stock" | "Low stock" | "Out of stock" =
      stock <= 0 ? "Out of stock" : stock <= 10 ? "Low stock" : "In stock";

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
      brands: {
        id: String(rawBrand?.id ?? ""),
        name: String(rawBrand?.name ?? ""),
      },
      sizes: Array.isArray(row.sizes) ? row.sizes.map(String) : [],
      stock,
      stockStatus,
      created_at: row.created_at ? String(row.created_at) : undefined,
    };
  },

  async deleteProduct(id: string): Promise<void> {
    console.log("🗑️ Attempting to delete product with ID:", id);
    const { error, data } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select();

    console.log("Delete response:", { error, data });

    if (error) {
      console.error("❌ Delete error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No rows were deleted. Check RLS policies.");
      throw new Error("Failed to delete product - no rows affected");
    }

    console.log("✅ Product deleted successfully:", data);
  },
};
