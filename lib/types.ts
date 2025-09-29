import z from "zod/v3";

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | undefined;
  onSale: boolean;
  brands: { id: string; name: string };
  images: string[];
  description: string;
  sizes: string[];
  stock: number;
  stockStatus?: "In stock" | "Low stock" | "Out of stock";
  created_at?: string | Date;
}

export interface ProductPayload {
  id?: string;
  title: string;
  price: number;
  originalPrice?: number | undefined;
  onSale: boolean;
  brand_id: string | null;
  brand_name?: string;
  images: string[];
  description: string;
  sizes: string[];
  stock: number;
  stockStatus?: "In stock" | "Low stock" | "Out of stock";
}

export const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(0, { message: "Price must be positive" }),
  originalPrice: z
    .number({ invalid_type_error: "Original price must be a number" })
    .min(0, { message: "Original price must be positive" })
    .optional(),
  onSale: z
    .boolean({ invalid_type_error: "On sale must be true or false" })
    .optional(),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int({ message: "Stock must be an integer" })
    .min(0, { message: "Stock cannot be negative" }),
  sizes: z.array(z.string().min(1, { message: "Size cannot be empty" }), {
    invalid_type_error: "Sizes must be an array of strings",
  }),
  brands: z.object({
    id: z
      .string()
      .uuid({ message: "Brand id must be a valid UUID" })
      .optional()
      .nullable(),
    name: z
      .string()
      .min(2, { message: "Brand name must be at least 2 characters" }),
  }),
  images: z
    .array(
      z.string().nonempty({ message: "Each image must be a non-empty string" })
    )
    .min(1, { message: "At least one image is required" }),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Profile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  size: string;
  color?: string;
  product_price: number;
  product_title: string;
  product_image: string;
}

export interface Order {
  id: string;
  full_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  notes?: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  order_items: OrderItem[];
  total: number;
  created_at?: string;
}
