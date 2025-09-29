"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface EditProductClientProps {
  productPromise: Promise<Product | null> | Product | null;
}

const EditProductClient = ({ productPromise }: EditProductClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  //const urlPageType = searchParams.get("type"); // "add" | "edit" | null

  //const product = use(productPromise);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormData(null),
    mode: "onChange",
  });

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    const normalized = Promise.resolve(productPromise);

    normalized
      .then((p) => {
        if (!mounted) return;
        if (p) {
          setProduct(p);
          methods.reset(getInitialFormData(p));
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load product", err);
        if (mounted) {
          setProduct(null);
        }
      });

    return () => {
      mounted = false;
      setIsLoading(false);
    };
  }, [productPromise]);

  function getInitialFormData(p?: Product | null): ProductFormData {
    return {
      title: p?.title ?? "",
      price: p?.price ?? 0,
      originalPrice: p?.originalPrice ?? 0,
      onSale: p?.onSale ?? false,
      description: p?.description ?? "",
      stock: p?.stock ?? 0,
      sizes: p?.sizes ?? [],
      brands: p?.brands ?? { id: null, name: "" },
      images: p?.images ?? [],
    };
  }

  // If loaded but no product found
  if (!product && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Produit non trouvé</p>
      </div>
    );
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);

    try {
      const urlPageType = searchParams.get("type"); // "add" | "edit" | null

      // 1) Process/upload images and keep order
      const finalImages = await processImagesServerSide(
        data.images ?? [],
        data.brands?.name ?? ""
      );
      console.log("product:", product);

      // 2) Build payload using finalImages
      const payload: ProductPayload = {
        id: product?.id,
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        onSale: data.onSale || true,
        stock: data.stock,
        sizes: data.sizes ?? [],
        brand_id: product?.brands?.id ?? "",
        images: finalImages,
      };

      // Attach id only when updating (pageType === "edit" AND product exists)
      /*if (pageType === "edit" && product?.id) {
        payload.id = product.id;
      }*/

      // 3) Choose HTTP method based on pageType
      const method = urlPageType === "edit" ? "PUT" : "POST";
      console.log("method:", urlPageType, method);

      // 4) Call API
      const res = await fetch("/api/product", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Product API error:", error);
        toast.error(error?.message ?? "Failed saving product", {
          className: "bg-white dark:bg-zinc-900",
          description: "Save product failed. Please try again",
          duration: 3000,
          position: "top-right",
        });
        setIsLoading(false);
        return;
      }

      const result = await res.json();
      console.log("Product response:", result);

      toast.success(
        urlPageType === "edit"
          ? "Product updated successfully!"
          : "Product created successfully!",
        {
          className: "bg-white",
          description:
            urlPageType === "edit"
              ? "Product updated successfully!"
              : "Product created successfully!",
          duration: 2000,
          position: "top-right",
        }
      );

      //methods.reset(getInitialFormData(result));
      router.push("/dashboard/products");
    } catch (err: unknown) {
      console.error("Network error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Network error while saving product",
        {
          className: "bg-white dark:bg-zinc-900",
          duration: 3000,
          position: "top-right",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
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
                onClick={methods.handleSubmit(onSubmit)}
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
