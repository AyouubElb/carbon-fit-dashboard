import AddProductClient from "@/components/dashboard/product/add-product-client";

export default function AddProductPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const pageType = searchParams?.type ?? null;
  return <AddProductClient pageType={pageType} />;
}
