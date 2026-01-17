import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteProduct } from "@/hooks/useProducts";

interface DeleteProductModalProps {
  id: string;
  title: string;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
}

const DeleteProductModal = ({
  id,
  title,
  deleteModalOpen,
  setDeleteModalOpen,
}: DeleteProductModalProps) => {
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  return (
    <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer &quot;{title}&quot; ? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
            disabled={deleteProduct.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
