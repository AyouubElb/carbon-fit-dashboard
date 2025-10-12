import AddProductClient from "@/components/dashboard/product/add-product-client";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

export default function AddProductPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddProductClient />
    </Suspense>
  );
}
