import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning";
}

const variants: Record<string, string> = {
  default: "bg-slate-100 text-slate-600",
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-50 text-success-600",
  warning: "bg-amber-50 text-amber-700",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};
