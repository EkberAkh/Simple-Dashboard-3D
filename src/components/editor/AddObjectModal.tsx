import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { objectSchema, type ObjectFormData } from "@/schemas/objectSchema";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { GeometrySelector } from "@/components/ui/GeometrySelector";
import type { Designer, GeometryType } from "@/api";

interface AddObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectFormData) => Promise<void>;
  designers: Designer[];
}

export const AddObjectModal: React.FC<AddObjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  designers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      name: "",
      designerId: "",
      color: "#6366F1",
      size: "normal",
      geometry: "box",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        designerId: "",
        color: "#6366F1",
        size: "normal",
        geometry: "box",
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: ObjectFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const designerOptions = designers.map((d) => ({
    value: d.id,
    label: d.fullName,
  }));

  const sizeOptions = [
    { value: "small", label: "Small" },
    { value: "normal", label: "Normal" },
    { value: "large", label: "Large" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Object to Scene"
      maxWidth="max-w-lg"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          label="Object Name"
          placeholder="e.g. Main Building"
          error={errors.name?.message}
          autoFocus
          {...register("name")}
        />

        {designers.length === 0 ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Assigned Designer
            </label>
            <p className="text-xs text-danger-500" role="alert">
              No designers available. Please add a designer first.
            </p>
          </div>
        ) : (
          <Controller
            name="designerId"
            control={control}
            render={({ field }) => (
              <Select
                label="Assigned Designer"
                placeholder="Select a designer..."
                options={designerOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.designerId?.message}
              />
            )}
          />
        )}

        <Controller
          name="geometry"
          control={control}
          render={({ field }) => (
            <GeometrySelector
              value={field.value as GeometryType}
              onChange={field.onChange}
              error={errors.geometry?.message}
            />
          )}
        />

        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <Select
              label="Size"
              options={sizeOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.size?.message}
            />
          )}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Color</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.color && (
            <p className="text-xs text-danger-500">{errors.color.message}</p>
          )}
        </div>

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
            Add Object
          </Button>
        </div>
      </form>
    </Modal>
  );
};
