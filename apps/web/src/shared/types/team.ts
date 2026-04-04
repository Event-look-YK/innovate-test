import type { Role } from "@/shared/constants/roles";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited";
  invitedAt: string;
};

export type InviteTeamPayload = {
  email: string;
  fullName: string;
  role: Role;
};
