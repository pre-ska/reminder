import { z } from "zod";

export const createTaskSchema = z.object({
  collectionId: z.number().nonnegative(),
  content: z.string().min(8, {
    message: "Task content must be at least 8 characters",
  }),
  expiresAt: z.date().optional(),
});

//! koristim kao type za createTaskSchema u akciji i createTaskDialogu
export type createTaskSchemaType = z.infer<typeof createTaskSchema>;
