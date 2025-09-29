import AddProductClient from "@/components/dashboard/product/add-product-client";
import { Suspense } from "react";

export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Loading ...</p>
        </div>
      }
    >
      <AddProductClient />
    </Suspense>
  );
}
