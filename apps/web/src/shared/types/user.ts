import type { Role } from "@/shared/constants/roles";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
