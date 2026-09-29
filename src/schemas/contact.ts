import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits"),

  company: z
    .string()
    .trim()
    .optional(),

  jobTitle: z
    .string()
    .trim()
    .optional(),
});

export type ContactFormData = z.infer<
  typeof contactSchema
>;