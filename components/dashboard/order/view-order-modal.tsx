import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Order, OrderItem } from "@/lib/types";
import React, { JSX } from "react";

interface ViewOrderProps {
  isViewModalOpen: boolean;
  setIsViewModalOpen: (open: boolean) => void;
  selectedOrder: Order | null;
  getStatusBadge: (status: Order["status"]) => JSX.Element;
}

const ViewOrderModal: React.FC<ViewOrderProps> = ({
  isViewModalOpen,
  setIsViewModalOpen,
  selectedOrder,
  getStatusBadge,
}) => {
  return (
    <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
      <DialogContent className="bg-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="max-w-sm mb-4">
          <DialogTitle className="text-gray-700">
            Détails de la commande:{" "}
            <span className="font-medium text-indigo-600">
              {selectedOrder?.id}
            </span>
          </DialogTitle>
        </DialogHeader>
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Client
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedOrder.full_name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <p className="text-sm text-gray-600">{selectedOrder.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Téléphone
                </Label>
                <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Date
                </Label>
                <p className="text-sm text-gray-600">
                  {selectedOrder?.created_at
                    ? new Date(selectedOrder.created_at).toLocaleDateString(
                        "fr-FR"
                      )
                    : "—"}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Adresse de livraison
              </Label>
              <p className="text-sm text-gray-600">{selectedOrder.address}</p>
            </div>
            {selectedOrder.notes && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Notes
                </Label>
                <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Statut
              </Label>
              <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Produits commandés
              </Label>
              <div className="mt-2 space-y-2">
                {selectedOrder.order_items.map(
                  (orderItem: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-700">
                          {orderItem.product_title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Taille: {orderItem.size} • Quantité:{" "}
                          {orderItem.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-700">
                        {orderItem.product_price}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-medium text-gray-700">Total</span>
              <span className="text-lg font-bold text-indigo-600">
                {selectedOrder.total}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderModal;
