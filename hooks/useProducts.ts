import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products.api";
import { Product, ProductPayload } from "@/lib/types";
import { toast } from "sonner";

interface UseProductsParams {
  brands?: string[];
  sortBy?: string;
  page?: number;
  pageSize?: number;
  stockStatus?: string;
}

export const useProducts = (
  params: UseProductsParams = {},
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product | null, Error>({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation: Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<ProductPayload, "id">) =>
      productsApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully!", {
        className: "bg-white",
        description: "The product has been added to your catalog",
        duration: 3000,
        position: "top-right",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create product", {
        className: "bg-white dark:bg-zinc-900",
        description: error.message || "An error occurred",
        duration: 3000,
        position: "top-right",
      });
    },
  });
};

// Mutation: Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<ProductPayload, "id">>;
    }) => productsApi.updateProduct(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
      toast.success("Product updated successfully!", {
        className: "bg-white",
        description: "Changes have been saved",
        duration: 3000,
        position: "top-right",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update product", {
        className: "bg-white dark:bg-zinc-900",
        description: error.message || "An error occurred",
        duration: 3000,
        position: "top-right",
      });
    },
  });
};

// Mutation: Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!", {
        className: "bg-white",
        description: "The product has been removed",
        duration: 3000,
        position: "top-right",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete product", {
        className: "bg-white dark:bg-zinc-900",
        description: error.message || "An error occurred",
        duration: 3000,
        position: "top-right",
      });
    },
  });
};
