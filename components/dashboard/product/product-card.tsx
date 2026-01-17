import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Edit, Eye, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { SUPABASE_IMAGE_URL } from "@/lib/supabase/client";
import DeleteProductModal from "./delete-product-modal";

interface ProductCardProps {
  product: Product;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setSelectedMainImage: React.Dispatch<React.SetStateAction<string>>;
  setViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProductCard = ({
  product,
  setSelectedProduct,
  setSelectedMainImage,
  setViewModalOpen,
}: ProductCardProps) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedMainImage(product.images[0] || "/placeholder.svg");
    setViewModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/products/edit/${product.id}?type=edit`);
  };

  return (
    <Card
      key={product.id}
      className="p-0 gap-0 group overflow-hidden bg-gradient-to-br from-white to-indigo-50/30 border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={SUPABASE_IMAGE_URL + product.images[0] || "/placeholder.svg"}
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
            <span className="text-sm font-medium text-gray-700">{4.5}</span>
            <span className="text-xs text-muted-foreground">(24 avis)</span>
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
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        id={product.id}
        title={product.title}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />
    </Card>
  );
};

export default ProductCard;
