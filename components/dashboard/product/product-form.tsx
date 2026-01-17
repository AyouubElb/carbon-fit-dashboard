"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContentEditableEditor from "@/components/ui/content-editable-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPABASE_IMAGE_URL } from "@/lib/supabase/client";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { useBrands } from "@/hooks/useBrands";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const ProductForm = () => {
  const methods = useFormContext(); // gets methods from FormProvider
  const { watch, setValue, control } = methods;
  const images = watch("images") ?? [];
  const { data: brands, isLoading: brandsLoading } = useBrands();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setValue("images", [...images, newImageUrl]); // update RHF images field
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageSrc = (img?: string) => {
    if (!img) return "/placeholder.svg";
    if (img.startsWith("data:") || img.startsWith("http")) return img; // preview or already full URL
    return SUPABASE_IMAGE_URL + img; // stored path -> build public url
  };

  const getAvailableSizesForSelect = () => {
    const selectedSizes: string[] = methods.getValues("sizes") || [];
    return AVAILABLE_SIZES.filter((size) => !selectedSizes.includes(size));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            Product Media
          </h2>
          <div className="space-y-6">
            <p className="text-sm font-semibold text-gray-700">Photo Product</p>
            <Controller
              name="images"
              control={methods.control}
              render={({ field, fieldState }) => {
                const imgs: string[] = field.value ?? [];

                return (
                  <div>
                    {/* If there are no images, show a simple, professional upload placeholder */}
                    {imgs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl border-gray-200">
                        <Upload className="w-8 h-8" />
                        <p className="text-sm text-gray-600 text-center">
                          No images uploaded yet.
                          <br /> Upload product photos to make this listing
                          stand out.
                        </p>
                        <label htmlFor="imageUpload" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-semibold transition-all duration-200"
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2 inline" />
                              Upload Images
                            </span>
                          </Button>
                        </label>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="relative w-full aspect-square col-span-2">
                            <Image
                              src={getImageSrc(imgs[0])}
                              alt="Main product image"
                              fill
                              className={`object-cover rounded-xl border border-gray-200 shadow-md transition-transform duration-500 group-hover:scale-110 ${
                                fieldState.error ? "ring-2 ring-red-300" : ""
                              }`}
                              aria-invalid={!!fieldState.error}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(imgs.filter((_, i) => i !== 0))
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg transition-all duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {imgs.slice(1).map((image, index) => (
                            <div
                              key={index + 1}
                              className="relative w-full aspect-square"
                            >
                              <Image
                                src={getImageSrc(image)}
                                alt={`Product ${index + 2}`}
                                fill
                                className="object-cover rounded-xl border border-gray-200 shadow-md transition-transform duration-500 group-hover:scale-110"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    imgs.filter((_, i) => i !== index + 1)
                                  )
                                }
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg transition-all duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Single hidden file input used by either the placeholder or the "Add more" button */}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Add / reuse your upload control (it calls handleImageUpload which uses setValue) */}
                    {imgs.length > 0 && (
                      <div className="mt-3">
                        <label htmlFor="imageUpload">
                          <Button
                            variant="outline"
                            className="w-full bg-transparent border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-semibold transition-all duration-200"
                            asChild
                          >
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Add More Image
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}

                    {/* Validation message */}
                    {fieldState.error && (
                      <p className="text-sm text-red-600 mt-2" role="alert">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            General Information
          </h2>
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="productName"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Product Name
              </Label>
              <Controller
                name="title"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="productName"
                      placeholder="Product name"
                      {...field}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-600 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Description
              </Label>
              <Controller
                name="description"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <>
                    <ContentEditableEditor
                      value={field.value ?? ""}
                      onChange={(html) => field.onChange(html)}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-600 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                    {/* preview */}
                    <div
                      className="mt-4"
                      dangerouslySetInnerHTML={{
                        __html: field.value ?? "",
                      }}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
            Pricing
          </h2>
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="basePrice"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Base Price
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Dh
                </span>
                <Controller
                  name="price"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="basePrice"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="discountPercentage"
                className="text-sm font-semibold text-gray-700 mb-2 block"
              >
                Original Price
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Dh
                </span>
                <Controller
                  name="originalPrice"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
            Brand
          </h2>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Product Brand
              </Label>
              <Controller
                name="brands"
                control={methods.control}
                render={({ field, fieldState }) => {
                  const selectedBrandId = field.value?.id;

                  return (
                    <>
                      <Select
                        value={selectedBrandId ?? ""}
                        onValueChange={(brandId) => {
                          const selectedBrand = brands?.find(
                            (b) => b.id === brandId
                          );
                          if (selectedBrand) {
                            field.onChange({
                              id: selectedBrand.id,
                              name: selectedBrand.name,
                            });
                          }
                        }}
                        disabled={brandsLoading}
                      >
                        <SelectTrigger className="border-gray-200 rounded-xl">
                          <SelectValue
                            placeholder={
                              brandsLoading
                                ? "Loading brands..."
                                : "Select brand"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200">
                          {brands?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full"></div>
            Inventory
          </h2>
          <div>
            <Label
              htmlFor="quantity"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Quantity
            </Label>
            <Controller
              name="stock"
              control={methods.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="quantity"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value || 0))
                    }
                    placeholder="Type product quantity"
                    className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-600 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
            Variation
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="variationType"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Variation Type
                </Label>
                <Controller
                  name="variationType"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-200">
                        <SelectItem value="size">Size</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label
                  htmlFor="sizeVariation"
                  className="text-sm font-semibold text-gray-700 mb-2 block"
                >
                  Size Selection
                </Label>
                <Controller
                  name="sizes"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        onValueChange={(val) =>
                          field.onChange([...field.value, val])
                        }
                      >
                        <SelectTrigger className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200">
                          <SelectValue placeholder="Add more sizes" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200">
                          {getAvailableSizesForSelect().map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                          {getAvailableSizesForSelect().length > 0 && (
                            <SelectItem
                              value="all"
                              className="font-semibold text-indigo-600"
                            >
                              Select All Sizes
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {methods.watch("sizes")?.length > 0 && (
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Selected Sizes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {methods.watch("sizes").map((size: string) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-lg font-medium flex items-center gap-2"
                    >
                      {size}
                      <button
                        onClick={() =>
                          methods.setValue(
                            "sizes",
                            methods
                              .getValues("sizes")
                              .filter((s: string) => s !== size)
                          )
                        }
                        className="hover:bg-indigo-300 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
