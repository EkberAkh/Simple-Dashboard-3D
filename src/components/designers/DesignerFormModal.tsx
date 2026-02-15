import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  designerSchema,
  type DesignerFormData,
} from "@/schemas/designerSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Designer } from "@/api";

interface DesignerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DesignerFormData) => Promise<void>;
  editingDesigner?: Designer | null;
}

export const DesignerFormModal: React.FC<DesignerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingDesigner,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DesignerFormData>({
    resolver: zodResolver(designerSchema),
    defaultValues: editingDesigner
      ? {
          fullName: editingDesigner.fullName,
          workingHours: editingDesigner.workingHours,
        }
      : {
          fullName: "",
          workingHours: 40,
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(
        editingDesigner
          ? {
              fullName: editingDesigner.fullName,
              workingHours: editingDesigner.workingHours,
            }
          : {
              fullName: "",
              workingHours: 40,
            },
      );
    }
  }, [isOpen, editingDesigner, reset]);

  const handleFormSubmit = async (data: DesignerFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDesigner ? "Edit Designer" : "Add New Designer"}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          label="Full Name"
          placeholder="e.g. Akbar Akhundov"
          error={errors.fullName?.message}
          autoFocus
          {...register("fullName")}
        />

        <Input
          label="Working Hours (per week)"
          type="number"
          placeholder="40"
          error={errors.workingHours?.message}
          {...register("workingHours", { valueAsNumber: true })}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {editingDesigner ? "Save Changes" : "Add Designer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
