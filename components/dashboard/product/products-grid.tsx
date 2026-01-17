"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Product } from "@/lib/types";
import ViewProduct from "./view-product";
import ProductCard from "./product-card";

interface ProductsGridProps {
  searchTerm: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  itemsPerRow: number;
  products: Product[];
}

export function ProductsGrid({
  searchTerm,
  currentPage,
  onPageChange,
  itemsPerPage,
  itemsPerRow,
  products,
}: ProductsGridProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMainImage, setSelectedMainImage] = useState("");

  // Client-side search filtering only (stockStatus is filtered on server)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brands.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchTerm]);

  // Display products (already paginated from API)
  const displayProducts = filteredProducts;

  // Calculate total pages based on filtered results
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );

  const getGridClass = () => {
    switch (itemsPerRow) {
      case 2:
        return "grid gap-6 sm:grid-cols-1 md:grid-cols-2";
      case 4:
        return "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className="space-y-6">
      <div className={getGridClass()}>
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            setSelectedProduct={setSelectedProduct}
            setSelectedMainImage={setSelectedMainImage}
            setViewModalOpen={setViewModalOpen}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="hover:bg-indigo-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "hover:bg-indigo-50"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="hover:bg-indigo-50"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      <ViewProduct
        viewModalOpen={viewModalOpen}
        setViewModalOpen={setViewModalOpen}
        selectedProduct={selectedProduct}
        selectedMainImage={selectedMainImage}
        setSelectedMainImage={setSelectedMainImage}
      />
    </div>
  );
}
