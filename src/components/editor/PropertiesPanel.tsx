import React, { useMemo, useState } from "react";
import {
  X,
  Trash2,
  Pencil,
  Box,
  User,
  Palette,
  Ruler,
  MapPin,
  Shapes,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { SceneObject, Designer } from "@/api";

interface PropertiesPanelProps {
  object: SceneObject;
  designers: Designer[];
  onEdit: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const SIZE_LABELS: Record<string, string> = {
  small: "Small",
  normal: "Normal",
  large: "Large",
};

const GEOMETRY_LABELS: Record<string, string> = {
  box: "Box",
  sphere: "Sphere",
  cylinder: "Cylinder",
  cone: "Cone",
  torus: "Torus",
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  object,
  designers,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const attachedDesigner = useMemo(
    () => designers.find((d) => d.id === object.designerId),
    [designers, object.designerId],
  );

  return (
    <>
      <aside
        className="w-full md:w-72 bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-white/8 flex flex-col overflow-hidden rounded-t-2xl md:rounded-2xl max-h-[70vh] md:max-h-none animate-slide-up md:animate-slide-in-right"
        aria-label="Object properties"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 md:hidden" />
          <h3 className="text-sm font-semibold text-white/90 tracking-wide">
            Properties
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close properties"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 overflow-auto">
          <div className="flex items-center gap-3 pb-3 border-b border-white/8">
            <div
              className="w-10 h-10 rounded-xl shadow-lg ring-2 ring-white/10 shrink-0"
              style={{ backgroundColor: object.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {object.name}
              </p>
              <p className="text-xs text-white/40">
                {attachedDesigner?.fullName ?? "No designer"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <PropertyRow
              icon={<Box size={13} />}
              label="Name"
              value={object.name}
            />
            <PropertyRow
              icon={<User size={13} />}
              label="Designer"
              value={attachedDesigner?.fullName ?? "—"}
            />
            <PropertyRow
              icon={<Shapes size={13} />}
              label="Geometry"
              value={GEOMETRY_LABELS[object.geometry] ?? object.geometry}
            />
            <PropertyRow
              icon={<Ruler size={13} />}
              label="Size"
              value={SIZE_LABELS[object.size] ?? object.size}
            />
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white/35 w-18 shrink-0">
                <Palette size={13} />
                <span className="text-xs">Color</span>
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm ring-1 ring-white/20"
                  style={{ backgroundColor: object.color }}
                />
                <span className="text-xs text-white/70 font-mono uppercase">
                  {object.color}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-white/35 w-18 shrink-0">
                <MapPin size={13} />
                <span className="text-xs">Position</span>
              </span>
              <div className="flex items-center gap-1.5">
                {(["X", "Y", "Z"] as const).map((axis, i) => (
                  <span
                    key={axis}
                    className="text-[10px] font-mono text-white/60 bg-white/6 rounded px-1.5 py-0.5 border border-white/8"
                  >
                    {axis}:{object.position[i].toFixed(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white text-xs font-medium px-3 py-2 transition-colors cursor-pointer"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center justify-center rounded-xl bg-white/6 hover:bg-red-500/20 text-white/50 hover:text-red-400 px-3 py-2 transition-colors cursor-pointer"
            aria-label="Delete object"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(object.id);
        }}
        title="Delete Object"
        message={`Are you sure you want to delete "${object.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
};

function PropertyRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-white/35 w-18 shrink-0">
        {icon}
        <span className="text-xs">{label}</span>
      </span>
      <span className="text-sm text-white/80 truncate">{value}</span>
    </div>
  );
}
