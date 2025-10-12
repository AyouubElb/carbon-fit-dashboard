import type { Product } from "@/lib/types";
import { getProductById } from "@/lib/services/product";
import EditProductClient from "@/components/dashboard/product/edit-product-client";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

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
  return <Loading />;
}
