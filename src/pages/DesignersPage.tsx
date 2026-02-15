import React, { useEffect, useState, useCallback } from "react";
import { Plus, Users } from "lucide-react";
import { useDesignerStore } from "@/store/designerStore";
import { DesignerCard } from "@/components/designers/DesignerCard";
import { DesignerFormModal } from "@/components/designers/DesignerFormModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import type { Designer } from "@/api";
import type { DesignerFormData } from "@/schemas/designerSchema";

export const DesignersPage: React.FC = () => {
  const {
    designers,
    isLoading,
    fetchDesigners,
    addDesigner,
    updateDesigner,
    removeDesigner,
  } = useDesignerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesigner, setEditingDesigner] = useState<Designer | null>(null);
  const [deletingDesignerId, setDeletingDesignerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  const handleAdd = useCallback(() => {
    setEditingDesigner(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((designer: Designer) => {
    setEditingDesigner(designer);
    setIsModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeletingDesignerId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingDesignerId) return;
    await removeDesigner(deletingDesignerId);
    setDeletingDesignerId(null);
  }, [deletingDesignerId, removeDesigner]);

  const handleSubmit = useCallback(
    async (data: DesignerFormData) => {
      if (editingDesigner) {
        await updateDesigner(editingDesigner.id, data);
      } else {
        await addDesigner(data);
      }
    },
    [editingDesigner, updateDesigner, addDesigner],
  );

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-screen-xl mx-auto px-3 py-5 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1">
              Designers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your team of {designers.length} designer
              {designers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            onClick={handleAdd}
            icon={<Plus size={16} />}
            size="sm"
            className="sm:!px-4 sm:!py-2 sm:!text-sm shrink-0"
          >
            Add New
          </Button>
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center py-20"
            role="status"
            aria-label="Loading designers"
          >
            <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full" />
            <span className="sr-only">Loading designers…</span>
          </div>
        ) : designers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
              <Users size={22} className="text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
              No designers yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              Add your first designer to get started.
            </p>
            <Button onClick={handleAdd} icon={<Plus size={16} />}>
              Add Designer
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            role="list"
            aria-label="Designers list"
          >
            {designers.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}

        <DesignerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          editingDesigner={editingDesigner}
        />

        <ConfirmModal
          isOpen={deletingDesignerId !== null}
          onClose={() => setDeletingDesignerId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Designer"
          message="Are you sure you want to delete this designer? Their attached objects will also be removed."
          confirmLabel="Delete"
        />
      </div>
    </div>
  );
};
