import { z } from "zod";

export const taskValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Please select a user to assign the task to"),
  status: z.enum(["PROGRESS", "COMPLETED", "ASSIGNED"]).optional(),
});
