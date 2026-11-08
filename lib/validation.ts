import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export const entrySchema = z.object({
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().uuid(),
  hours: z.coerce.number().min(0.25).max(24),
  note: z.string().max(280).optional().default(""),
});

export const entryUpdateSchema = entrySchema.partial();

export const reviewSchema = z
  .object({
    action: z.enum(["approve", "reject"]),
    note: z.string().max(500).optional().default(""),
  })
  .refine((value) => value.action !== "reject" || value.note.trim().length > 0, {
    message: "A rejection note is required.",
    path: ["note"],
  });

export const projectSchema = z.object({
  name: z.string().min(2).max(120),
  code: z
    .string()
    .min(2)
    .max(24)
    .regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers, and dashes."),
  client: z.string().min(2).max(120),
  billable: z.boolean().default(true),
});

export const projectUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  client: z.string().min(2).max(120).optional(),
  billable: z.boolean().optional(),
  active: z.boolean().optional(),
});
