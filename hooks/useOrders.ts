// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders.api";
import { toast } from "sonner";
import { Order } from "@/lib/types";

export const useOrders = (params: {
  page: number;
  pageSize: number;
  status: string;
  search: string;
}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (prev) => prev, // Keep old data while fetching
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Order> }) =>
      ordersApi.updateOrder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order");
    },
  });
};
