import { ROLES, type Role } from "@/shared/constants/roles";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  invitedAt: string;
};

export const mockTeam: TeamMember[] = [
  {
    id: "m1",
    name: "Ivan Petrov",
    email: "ivan@carrier.test",
    role: ROLES.CARRIER_MANAGER,
    status: "active",
    invitedAt: "2026-01-10",
  },
  {
    id: "m2",
    name: "Olena Koval",
    email: "olena@carrier.test",
    role: ROLES.CARRIER_DRIVER,
    status: "active",
    invitedAt: "2026-01-12",
  },
  {
    id: "m3",
    name: "Dmytro Shevchenko",
    email: "dmytro@carrier.test",
    role: ROLES.CARRIER_DRIVER,
    status: "active",
    invitedAt: "2026-02-01",
  },
  {
    id: "m4",
    name: "Maria Bondar",
    email: "maria@carrier.test",
    role: ROLES.CARRIER_WAREHOUSE_MANAGER,
    status: "active",
    invitedAt: "2026-02-15",
  },
];
