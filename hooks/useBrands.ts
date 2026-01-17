import { useQuery } from "@tanstack/react-query";
import { brandsApi } from "@/lib/api/brands.api";
import { Brand } from "@/lib/types";

export const useBrands = () => {
  return useQuery<Brand[], Error>({
    queryKey: ["brands"],
    queryFn: () => brandsApi.getBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutes - brands rarely change
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection time
  });
};
