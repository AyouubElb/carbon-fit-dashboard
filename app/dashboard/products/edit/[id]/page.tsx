import type { Product } from "@/lib/types";
import EditProductClient from "@/components/dashboard/product/edit-product-client";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { productsApi } from "@/lib/api/products.api";
import { notFound } from "next/dist/client/components/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //const productPromise: Promise<Product | null> = getProductById(id);
  const product: Product | null = await productsApi.getProductById(id);
  console.log("🚩 EditProductPage fetched product", { id, product });

  if (!product) {
    notFound(); // Next.js 404
  }

  return (
    <Suspense fallback={loadingData()}>
      <EditProductClient product={product} />
    </Suspense>
  );
}

function loadingData() {
  return <Loading />;
}
