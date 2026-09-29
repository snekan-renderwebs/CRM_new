import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required"),

  description: z
    .string()
    .optional(),

  dueDate: z
    .string()
    .optional(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),

  status: z.enum([
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ]),
  userId: z.string().min(1, "Please select a user"),
});

export type TaskFormData = z.infer<
  typeof taskSchema
>;