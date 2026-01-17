"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Product,
  ProductFormData,
  ProductPayload,
  productSchema,
} from "@/lib/types";
import ProductForm from "./product-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { processImagesServerSide } from "@/lib/images";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";

const EditProductClient = ({ product }: { product: Product | null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPageType = searchParams.get("type"); // "add" | "edit" | null

  // Mutation hooks
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormData(product),
    mode: "onChange",
  });

  function getInitialFormData(p?: Product | null): ProductFormData {
    return {
      title: p?.title ?? "",
      price: p?.price ?? 0,
      originalPrice: p?.originalPrice ?? 0,
      onSale: p?.onSale ?? false,
      description: p?.description ?? "",
      stock: p?.stock ?? 0,
      sizes: p?.sizes ?? [],
      brands: p?.brands ?? { id: "", name: "" },
      images: p?.images ?? [],
    };
  }

  // If loaded but no product found (only for edit mode)
  if (urlPageType === "edit" && !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Produit non trouvé</p>
      </div>
    );
  }

  //const isLoading = createProduct.isPending || updateProduct.isPending;

  const onSubmit = async (data: ProductFormData) => {
    try {
      const finalImages = await processImagesServerSide(
        data.images ?? [],
        data.brands?.name ?? ""
      );

      const payload: ProductPayload = {
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        onSale: data.onSale || false,
        stock: data.stock,
        sizes: data.sizes ?? [],
        brand_id: data.brands?.id || null,
        images: finalImages,
      };

      if (urlPageType === "edit" && product?.id) {
        // Update existing product
        await updateProduct.mutateAsync({
          id: product.id,
          payload,
        });
      } else {
        // Create new product
        await createProduct.mutateAsync(payload);
      }

      // Navigate to products list on success
      router.push("/dashboard/products");
    } catch (err: unknown) {
      // Error handling is done by mutation hooks
      console.error("Save error:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          methods.handleSubmit(onSubmit)(e);
        }}
        className="space-y-8"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => router.push("/")}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Dashboard
              </button>
              <span className="text-indigo-300">›</span>
              <button
                onClick={() => router.push("/products")}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Product List
              </button>
              <span className="text-indigo-300">›</span>
              <span className="text-indigo-900 font-medium">Edit Product</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/products")}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {methods.formState.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Save Product
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2">
            Edit Product
          </h1>
          <p className="text-gray-600">Update your product information</p>
        </div>

        <ProductForm />
      </form>
    </FormProvider>
  );
};

export default EditProductClient;
