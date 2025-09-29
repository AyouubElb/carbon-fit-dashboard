import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface ProductSearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
  itemsPerRow: number;
  setItemsPerRow: (num: number) => void;
}

const ProductSearchAndFilters: React.FC<ProductSearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  itemsPerRow,
  setItemsPerRow,
}) => {
  return (
    <>
      <div className="bg-gradient-to-r from-white to-indigo-50/30 p-6 rounded-2xl border border-indigo-200 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
            <Input
              placeholder="Rechercher des produits..."
              className="pl-12 h-12 bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm text-gray-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", "In stock", "Out of stock", "Low stock"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={
                  statusFilter === status
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-semibold px-4 py-2"
                    : "bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 shadow-sm font-semibold px-4 py-2"
                }
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl border border-gray-200 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Produits par page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-indigo-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                Colonnes:
              </span>
              <select
                value={itemsPerRow}
                onChange={(e) => setItemsPerRow(Number(e.target.value))}
                className="px-4 py-2 border border-indigo-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                <option value={2}>2 par ligne</option>
                <option value={3}>3 par ligne</option>
                <option value={4}>4 par ligne</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSearchAndFilters;
