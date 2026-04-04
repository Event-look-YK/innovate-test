import { z } from "zod";

import { ROLES } from "@/shared/constants/roles";

export const inviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum([
    ROLES.CARRIER_MANAGER,
    ROLES.CARRIER_DRIVER,
    ROLES.CARRIER_WAREHOUSE_MANAGER,
  ]),
});

export type InviteValues = z.infer<typeof inviteSchema>;
