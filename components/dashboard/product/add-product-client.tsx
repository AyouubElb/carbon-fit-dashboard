"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
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

const AddProductClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  //const urlPageType = searchParams.get("type"); // "add" | "edit" | null

  //const product = use(productPromise);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormData(null),
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
      brands: p?.brands ?? { id: null, name: "" },
      images: p?.images ?? [],
    };
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    console.log("test");
    try {
      const urlPageType = searchParams.get("type"); // "add" | "edit" | null

      // 1) Process/upload images and keep order
      const finalImages = await processImagesServerSide(
        data.images ?? [],
        data.brands?.name ?? ""
      );

      // 2) Build payload using finalImages
      const payload: ProductPayload = {
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        onSale: data.onSale || true,
        stock: data.stock,
        sizes: data.sizes ?? [],
        brand_name: data?.brands?.name ?? "",
        brand_id: data?.brands?.id ?? "",
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
          description: "Add product failed. Please try again",
          duration: 3000,
          position: "top-right",
        });
        setIsLoading(false);
        return;
      }

      const result = await res.json();
      console.log("Product response:", result);

      toast.success("Product created successfully!", {
        className: "bg-white",
        description: "Product created successfully!",
        duration: 2000,
        position: "top-right",
      });

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
      <form
        onSubmit={methods.handleSubmit(onSubmit, (errors) =>
          console.log("validation errors", errors)
        )}
        className="space-y-8"
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Dashboard
              </button>
              <span className="text-indigo-300">›</span>
              <button
                onClick={() => router.push("/dashboard/products")}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Product List
              </button>
              <span className="text-indigo-300">›</span>
              <span className="text-indigo-900 font-medium">Add Product</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/products")}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                disabled={methods.formState.isSubmitting}
                onClick={methods.handleSubmit(onSubmit, (errors) =>
                  console.log("validation errors", errors)
                )}
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
                    Add Product
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2">
            Add Product
          </h1>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>

        <ProductForm />
      </form>
    </FormProvider>
  );
};

export default AddProductClient;
