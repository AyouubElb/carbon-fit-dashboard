"use client";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Product } from "@/lib/types";
import { SUPABASE_IMAGE_URL } from "@/lib/supabase/client";
import Image from "next/image";
import ViewProduct from "./view-product";

interface ProductsGridProps {
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  itemsPerRow: number;
  products: Product[];
}

export function ProductsGrid({
  searchTerm,
  statusFilter,
  currentPage,
  onPageChange,
  itemsPerPage,
  itemsPerRow,
  products,
}: ProductsGridProps) {
  const router = useRouter();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMainImage, setSelectedMainImage] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brands.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || product.stockStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedMainImage(product.images[0] || "/placeholder.svg");
    setViewModalOpen(true);
    console.log("Viewing product:", product);
  };

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/products/edit/${product.id}?type=edit`);
  };

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
        {paginatedProducts.map((product) => (
          <Card
            key={product.id}
            className="p-0 gap-0 group overflow-hidden bg-gradient-to-br from-white to-indigo-50/30 border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
          >
            <CardHeader className="p-0 relative">
              <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={
                    SUPABASE_IMAGE_URL + product.images[0] || "/placeholder.svg"
                  }
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={
                      product.stockStatus === "In stock"
                        ? "default"
                        : product.stockStatus === "Out of stock"
                        ? "destructive"
                        : "secondary"
                    }
                    className={`shadow-lg backdrop-blur-sm ${
                      product.stockStatus === "In stock"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : product.stockStatus === "Out of stock"
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }`}
                  >
                    {product.stockStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full inline-block">
                    {product.brands.name}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {product.rating || 4.5}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (24 avis)
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-indigo-700">
                    DH{product.price}
                  </span>
                  <div className="text-right">
                    <span className="text-sm text-gray-800">Stock</span>
                    <div className="text-sm font-semibold text-gray-700">
                      {product.stock} unités
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <div className="flex flex-wrap justify-center w-full gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800 shadow-sm"
                  onClick={() => handleView(product)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800 shadow-sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-600">
            Affichage de {startIndex + 1} à{" "}
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} sur{" "}
            {filteredProducts.length} produits
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
