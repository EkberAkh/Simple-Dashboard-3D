import { z } from "zod";

export const designerSchema = z.object({
  fullName: z
    .string()
    .min(1, "This field is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes",
    ),
  workingHours: z
    .number({ error: "This field is required" })
    .min(1, "Working hours must be at least 1")
    .max(80, "Working hours must be at most 80"),
});

export type DesignerFormData = z.infer<typeof designerSchema>;
