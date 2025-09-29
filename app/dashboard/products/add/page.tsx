import AddProductClient from "@/components/dashboard/product/add-product-client";

type SearchParams = { type?: string | string[] | undefined };

export default function AddProductPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const pageType = searchParams?.type ?? null;
  return <AddProductClient pageType={pageType} />;
}
