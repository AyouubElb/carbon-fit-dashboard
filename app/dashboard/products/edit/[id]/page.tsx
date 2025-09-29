import type { Product } from "@/lib/types";
import { getProductById } from "@/lib/services/product";
import EditProductClient from "@/components/dashboard/product/edit-product-client";
import { Suspense } from "react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productPromise: Promise<Product | null> = getProductById(id);

  return (
    <Suspense fallback={loadingData()}>
      <EditProductClient productPromise={productPromise} />
    </Suspense>
  );
}

function loadingData() {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-lg text-gray-500">Loading ...</p>
    </div>
  );
}
