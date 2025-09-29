"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const AddProductButton = () => {
  const router = useRouter();

  return (
    <Button
      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold px-6 py-3 h-12"
      onClick={() => router.push("/dashboard/products/add")}
    >
      <Plus className="mr-2 h-5 w-5" />
      Ajouter un produit
    </Button>
  );
};

export default AddProductButton;
