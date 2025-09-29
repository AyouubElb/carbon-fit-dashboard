import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditedFields } from "@/hooks/use-edit-fields";
import { editOrder } from "@/lib/services/order";
import { Order } from "@/lib/types";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface EditOrderModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  editingOrder: Order | null;
  setEditingOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isEditModalOpen,
  setIsEditModalOpen,
  editingOrder,
  setEditingOrder,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    current: local,
    reset,
    onChange,
    getChanges,
    isDirty,
  } = useEditedFields<Order>(editingOrder);

  // reset local state when editingOrder changes / modal opens
  useEffect(() => {
    reset(editingOrder ?? null);
  }, [editingOrder, reset]);

  const handleSaveEdit = async () => {
    setError(null);
    if (!editingOrder) return;

    const updates = getChanges();
    if (!updates) {
      // nothing changed — close modal
      setIsEditModalOpen(false);
      setEditingOrder(null);
      return;
    }

    try {
      setLoading(true);
      await editOrder(editingOrder.id, updates);
      setIsEditModalOpen(false);
      setEditingOrder(null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to save");
      console.log(err?.message ?? "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingOrder(null);
  };
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="bg-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="max-w-sm mb-4">
          <DialogTitle className="text-gray-700">
            Modifier la commande{" "}
            <span className="text-indigo-600 font-medium">
              {editingOrder?.id}
            </span>
          </DialogTitle>
        </DialogHeader>
        {editingOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-gray-700">
                  Client
                </Label>
                <Input
                  id="customer"
                  className="text-gray-600"
                  value={local?.full_name ?? ""}
                  onChange={(e) => onChange("full_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-gray-600"
                  value={local?.email ?? ""}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  className="text-gray-600"
                  value={local?.phone ?? ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Statut
                </Label>
                <Select
                  value={local?.status ?? ""}
                  onValueChange={(value) => onChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">En attente</SelectItem>
                    <SelectItem value="Processing">En cours</SelectItem>
                    <SelectItem value="Shipped">Expédiée</SelectItem>
                    <SelectItem value="Delivered">Livrée</SelectItem>
                    <SelectItem value="Cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">
                Adresse de livraison
              </Label>
              <Input
                id="address"
                className="text-gray-600"
                value={local?.address ?? ""}
                onChange={(e) => onChange("address", e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="text-gray-600 bg-transparent border !border-gray-300 shadow-sm hover:!bg-[#0089E9] hover:text-white"
                onClick={handleCancelEdit}
              >
                Annuler
              </Button>
              <Button
                className="text-white !bg-indigo-700 shadow-sm hover:!bg-indigo-600"
                onClick={handleSaveEdit}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Save
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
