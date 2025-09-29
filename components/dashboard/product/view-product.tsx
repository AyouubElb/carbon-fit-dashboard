import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SUPABASE_IMAGE_URL } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ViewProductProps {
  viewModalOpen: boolean;
  setViewModalOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  selectedMainImage: string | null;
  setSelectedMainImage: (image: string) => void;
}

const ViewProduct = ({
  viewModalOpen,
  setViewModalOpen,
  selectedProduct,
  selectedMainImage,
  setSelectedMainImage,
}: ViewProductProps) => {
  if (!selectedProduct) return null;

  return (
    <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
      <DialogContent
        size="xl"
        className=" w-full max-h-[95vh] overflow-hidden bg-white border border-gray-200 shadow-2xl p-0"
      >
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Détails du produit
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto max-h-[calc(95vh-100px)] p-6">
          {/* Left: Image gallery */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-gray-50">
              <Image
                src={
                  SUPABASE_IMAGE_URL +
                    (selectedMainImage || selectedProduct.images[0]) ||
                  "/placeholder.svg"
                }
                alt={selectedProduct.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnails */}
            {selectedProduct.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {selectedProduct.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMainImage(image)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border transition-all duration-200 ${
                      selectedMainImage === image
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-indigo-400"
                    }`}
                  >
                    <Image
                      src={SUPABASE_IMAGE_URL + image || "/placeholder.svg"}
                      alt={`${selectedProduct.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Title + Brand + Rating */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                {selectedProduct.title}
              </h2>
              <div className="flex items-center gap-4 mt-3">
                <Badge className="bg-indigo-100 text-indigo-800 font-medium">
                  {selectedProduct.brands.name}
                </Badge>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-700">
                    4.5
                  </span>
                  <span className="text-sm text-gray-500">(127 avis)</span>
                </div>
              </div>
            </div>

            {/* Price / Stock / Status */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Prix
                </Label>
                <p className="text-2xl font-bold text-indigo-700">
                  {selectedProduct.price} €
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Stock
                </Label>
                <p className="text-xl font-semibold text-gray-900">
                  {selectedProduct.stock} unités
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Statut
                </Label>
                <Badge
                  className={`px-3 py-1 ${
                    selectedProduct.stockStatus === "In stock"
                      ? "bg-green-100 text-green-800"
                      : selectedProduct.stockStatus === "Out of stock"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedProduct.stockStatus}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 block mb-2">
                Description
              </Label>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selectedProduct.description,
                }}
              />
            </div>

            {/* Sizes & Colors */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Label className="text-sm font-semibold text-gray-700 block mb-3">
                  Tailles disponibles
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes?.map((size: string) => (
                    <Badge
                      key={size}
                      variant="outline"
                      className="px-3 py-1 text-sm font-medium border-indigo-200 text-indigo-700"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
              {/*<div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Label className="text-sm font-semibold text-gray-700 block mb-3">
                  Couleurs disponibles
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(selectedProduct.colors || ["Blanc"]).map(
                    (color: string) => (
                      <Badge
                        key={color}
                        variant="outline"
                        className="px-3 py-1 text-sm font-medium border-indigo-200 text-indigo-700"
                      >
                        {color}
                      </Badge>
                    )
                  )}
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProduct;
