import { z } from "zod";

export const taskValidationSchema = z.object({
  title: z.string().nonempty("Title cannot be empty"),
  description: z.string().nonempty("Description cannot be empty"),
});
