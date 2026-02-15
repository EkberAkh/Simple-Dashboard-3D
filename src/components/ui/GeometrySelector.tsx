import React from "react";
import { Box, Circle, Triangle, Cylinder } from "lucide-react";
import type { GeometryType } from "@/api";

interface GeometryOption {
  type: GeometryType;
  label: string;
  icon: React.ReactNode;
}

const GEOMETRY_OPTIONS: GeometryOption[] = [
  { type: "box", label: "Box", icon: <Box size={20} /> },
  { type: "sphere", label: "Sphere", icon: <Circle size={20} /> },
  { type: "cylinder", label: "Cylinder", icon: <Cylinder size={20} /> },
  {
    type: "cone",
    label: "Cone",
    icon: <Triangle size={20} />,
  },
  {
    type: "torus",
    label: "Torus",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="12" rx="10" ry="5" />
        <ellipse cx="12" cy="12" rx="4" ry="2" />
      </svg>
    ),
  },
];

interface GeometrySelectorProps {
  value: GeometryType;
  onChange: (type: GeometryType) => void;
  compact?: boolean;
  error?: string;
}

export const GeometrySelector: React.FC<GeometrySelectorProps> = ({
  value,
  onChange,
  compact = false,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {!compact && (
        <label className="text-sm font-medium text-slate-700">Geometry</label>
      )}
      <div
        className={`grid ${compact ? "grid-cols-5 gap-1" : "grid-cols-5 gap-1.5 sm:gap-2"}`}
      >
        {GEOMETRY_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onChange(opt.type)}
            className={`
              flex flex-col items-center justify-center rounded-lg border-2 transition-all cursor-pointer
              ${compact ? "p-1.5 gap-0.5" : "p-1.5 gap-0.5 sm:p-2.5 sm:gap-1"}
              ${
                value === opt.type
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-border bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }
            `}
            aria-label={`Select ${opt.label} geometry`}
            aria-pressed={value === opt.type}
          >
            {opt.icon}
            <span
              className={`font-medium ${compact ? "text-[9px]" : "text-[9px] sm:text-[10px]"}`}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-danger-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
