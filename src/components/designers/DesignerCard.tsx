import React from "react";
import { Clock, Box, Trash2, Edit2 } from "lucide-react";
import type { Designer } from "@/api";
import { Badge } from "@/components/ui/Badge";

interface DesignerCardProps {
  designer: Designer;
  onEdit: (designer: Designer) => void;
  onDelete: (id: string) => void;
}

export const DesignerCard: React.FC<DesignerCardProps> = ({
  designer,
  onEdit,
  onDelete,
}) => {
  const initials = designer.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      role="listitem"
      className="bg-white rounded-xl border border-border p-4 sm:p-5 hover:shadow-md transition-shadow duration-200 group"
      aria-label={designer.fullName}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs sm:text-sm font-bold">
          {initials}
        </div>

        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(designer)}
            className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
            aria-label={`Edit ${designer.fullName}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(designer.id)}
            className="p-1.5 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
            aria-label={`Delete ${designer.fullName}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mb-2.5 sm:mb-3 truncate">
        {designer.fullName}
      </h3>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <Badge variant="default">
          <Clock size={12} className="mr-1" />
          {designer.workingHours}h/week
        </Badge>
        <Badge variant="primary">
          <Box size={12} className="mr-1" />
          {designer.attachedObjectsCount} object
          {designer.attachedObjectsCount !== 1 ? "s" : ""}
        </Badge>
      </div>
    </article>
  );
};
