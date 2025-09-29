"use client";

import { OrdersTable } from "@/components/dashboard/order/orders-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Gestion des Commandes
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Suivez et gérez toutes vos commandes
          </p>
        </div>
      </div>

      {/* filters */}
      <div className="bg-gradient-to-r from-white to-indigo-50/30 p-6 rounded-2xl border border-indigo-200 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-400" />
            <Input
              placeholder="Rechercher par numéro de commande, nom ou email..."
              className="pl-12 h-12 bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 shadow-sm text-gray-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
              (status) => (
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
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
        <OrdersTable searchTerm={searchTerm} statusFilter={statusFilter} />
      </div>
    </div>
  );
}
