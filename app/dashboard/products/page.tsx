import ProductsClient from "@/components/dashboard/product/products-client";
import { getProducts } from "@/lib/services/product";

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <>
      <ProductsClient products={products} />
    </>
  );
}
