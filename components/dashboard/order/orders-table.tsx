"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewOrderModal from "./view-order-modal";
import { ChevronLeft, ChevronRight, Edit, Eye } from "lucide-react";
import EditOrderModal from "./edit-order-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface OrdersTableProps {
  searchTerm: string;
  statusFilter: string;
}

function OrdersTableSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Commandes récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Commande
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Client
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Statut
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Articles
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Synchronisé
                </th>
                <th className="text-left py-3 px-4 font-medium text-card-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <Skeleton className="bg-gray-300 h-4 w-32" />
                      <Skeleton className="bg-gray-300 h-3 w-40" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-4 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-6 w-20 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-4 w-12" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="bg-gray-300 h-4 w-8" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Skeleton className="bg-gray-300 h-8 w-8" />
                      <Skeleton className="bg-gray-300 h-8 w-8" />
                      <Skeleton className="bg-gray-300 h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrdersTable({ searchTerm, statusFilter }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search to prevent API call on every keystroke
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const ordersPerPage = 10;

  const { data, isLoading, error } = useOrders({
    page: currentPage,
    pageSize: ordersPerPage,
    status: statusFilter,
    search: debouncedSearch,
  });

  if (isLoading) return <OrdersTableSkeleton />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const { orders, total } = data || { orders: [], total: 0 };
  const totalPages = Math.ceil(total / ordersPerPage);

  // Calculate display range
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = Math.min(startIndex + ordersPerPage, total);

  /*
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    async function load() {
      if (profileLoading) return; // wait for profile resolution
      if (!profile) {
        setErr("Not logged in");
        return;
      }
      if (!profile.is_admin) {
        setErr("Access denied: admin only");
        return;
      }

      setIsLoading(true);
      try {
        const data = await getOrders(profile);
        setOrders(data);
      } catch (e: unknown) {
        setErr((e as Error).message ?? "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [profile, profileLoading]);

  if (err) return <div className="text-red-500">{err}</div>;

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );
*/

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-[#0089E9] text-white">{status}</Badge>;
      case "Shipped":
        return <Badge className="bg-indigo-600 text-white">{status}</Badge>;
      case "Delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditModalOpen(true);
  };

  /*if (isLoading || profileLoading) {
    return <OrdersTableSkeleton />;
  }*/

  return (
    <>
      <Card className="!w-full !max-w-full bg-card border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-600">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full max-w-full min-w-0">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="text-left py-3 px-4 font-medium">Commande</th>
                  <th className="text-left py-3 px-4 font-medium">Client</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Statut</th>
                  <th className="text-left py-3 px-4 font-medium">Articles</th>
                  <th className="text-left py-3 px-4 font-medium">Total</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Synchronisé A Sheets
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="text-gray-600 border-b border-gray-200 hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        {order.id.length > 5
                          ? `${order.id.slice(0, 5)}...`
                          : order.id}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{order.full_name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-4">
                      {order.order_items.length} article
                      {order.order_items.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-indigo-600">
                        {order.total}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg">
                        {order.synced_to_sheets ? "✅" : "❌"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="!border !border-gray-200 !bg-white !shadow-sm hover:!bg-[#0089E9] hover:!text-white"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="!border !border-gray-200 !bg-white !shadow-sm hover:!bg-[#0089E9] hover:!text-white"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Affichage de {total === 0 ? 0 : startIndex + 1} à {endIndex} sur{" "}
                {total} commande{total > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="!text-gray-600 !border !border-gray-200 !bg-white !shadow-sm hover:!bg-[#0089E9] hover:!text-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} sur {totalPages || 1}
                </span>
                <Button
                  size="sm"
                  className="!text-gray-600 !border !border-gray-200 !bg-white !shadow-sm hover:!bg-[#0089E9] hover:!text-white"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || isLoading}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ViewOrderModal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={() => setIsViewModalOpen(false)}
        selectedOrder={selectedOrder}
        getStatusBadge={getStatusBadge}
      />

      <EditOrderModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={() => setIsEditModalOpen(false)}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
      />
    </>
  );
}
