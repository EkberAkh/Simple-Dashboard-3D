import { z } from "zod";

export const objectSchema = z.object({
  name: z
    .string()
    .min(1, "This field is required")
    .max(50, "Name must be at most 50 characters"),
  designerId: z.string().min(1, "This field is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  size: z.enum(["small", "normal", "large"], {
    error: "This field is required",
  }),
  geometry: z.enum(["box", "sphere", "cylinder", "cone", "torus"], {
    error: "This field is required",
  }),
});

export type ObjectFormData = z.infer<typeof objectSchema>;
