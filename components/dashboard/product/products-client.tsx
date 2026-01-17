"use client";
import React, { useState } from "react";
import { ProductsGrid } from "./products-grid";
import ProductSearchAndFilters from "./product-search-and-filters";
import AddProductButton from "./add-product-button";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [itemsPerRow, setItemsPerRow] = useState(3);

  // Fetch products with React Query
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useProducts({
    page: currentPage,
    pageSize: itemsPerPage,
    stockStatus: statusFilter,
  });

  return (
    <div className="space-y-8">
      {/* Header - Always visible */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Gestion des Produits
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Gérez votre catalogue de t-shirts automobiles
          </p>
        </div>
        <AddProductButton />
      </div>

      {/* Search & Filters - Show during loading, hide on error */}
      {!error && (
        <ProductSearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerRow={itemsPerRow}
          setItemsPerRow={setItemsPerRow}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 space-y-4"
            >
              <Skeleton className="w-full aspect-square rounded-md" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="text-6xl">⚠️</div>
          <h3 className="text-2xl font-semibold text-red-600">
            Failed to load products
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {error.message ||
              "An unexpected error occurred while fetching products."}
          </p>
          <Button onClick={() => refetch()} variant="default" size="lg">
            🔄 Retry
          </Button>
        </div>
      )}

      {/* Products Grid - Success State */}
      {!isLoading && !error && (
        <ProductsGrid
          searchTerm={searchTerm}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          itemsPerRow={itemsPerRow}
          products={products}
        />
      )}
    </div>
  );
};

export default ProductsClient;
