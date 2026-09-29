import { z } from "zod";

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number is too long"),

  company: z
    .string()
    .max(100, "Company name is too long")
    .optional()
    .or(z.literal("")),

  source: z
    .string()
    .max(50, "Source is too long")
    .optional()
    .or(z.literal("")),

  status: z
    .enum(["NEW", "CONTACTED", "QUALIFIED", "LOST"])
    .default("NEW"),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .optional()
    .or(z.literal("")),
});

export type CreateLeadInput = z.infer<
  typeof createLeadSchema
>;