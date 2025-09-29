"use client";
import React, { useState } from "react";
import { ProductsGrid } from "./products-grid";
import ProductSearchAndFilters from "./product-search-and-filters";
import AddProductButton from "./add-product-button";
import { Product } from "@/lib/types";

const ProductsClient = ({ products }: { products: Product[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [itemsPerRow, setItemsPerRow] = useState(3);

  return (
    <div className="space-y-8">
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

      {/* Products Grid */}
      <ProductsGrid
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        itemsPerRow={itemsPerRow}
        products={products}
      />
    </div>
  );
};

export default ProductsClient;
