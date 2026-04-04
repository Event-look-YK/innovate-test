import { z } from "zod";

import { CARGO_TYPES, TASK_PRIORITIES } from "@/shared/constants/task-status";

export const taskCreateSchema = z.object({
  title: z.string().min(2),
  cargoDescription: z.string().min(2),
  cargoType: z.enum(CARGO_TYPES),
  weightT: z.coerce.number().positive(),
  originLabel: z.string().min(2),
  destinationLabel: z.string().min(2),
  deadline: z.string().min(1),
  priority: z.enum(TASK_PRIORITIES),
  assignedTruckId: z.string().optional(),
  assignedMemberId: z.string().optional(),
  notes: z.string().optional(),
});

export type TaskCreateValues = z.infer<typeof taskCreateSchema>;
