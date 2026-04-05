import { z } from "zod";

export const truckFormSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["Truck", "Semi", "Refrigerated", "Flatbed"]),
  payloadT: z.coerce.number().positive(),
  trailerId: z.string().optional(),
  trackerId: z.string().min(1),
  locationLabel: z.string().min(1),
});

export type TruckFormValues = z.infer<typeof truckFormSchema>;

export const truckEditSchema = truckFormSchema.extend({
  status: z.enum(["idle", "on_road", "maintenance"]),
});

export type TruckEditValues = z.infer<typeof truckEditSchema>;
