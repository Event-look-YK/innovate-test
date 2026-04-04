import { inviteSchema } from "../zod-schemas";
import { zodToSchema, ErrorResponse } from "./common";

const TeamMember = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    invitedAt: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["active", "invited"] },
  },
};

const InviteResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    email: { type: "string" },
    fullName: { type: "string" },
    role: { type: "string", enum: ["CARRIER_MANAGER", "CARRIER_DRIVER", "CARRIER_WAREHOUSE_MANAGER"] },
    status: { type: "string", enum: ["invited"] },
  },
};

export const teamSchemas = {
  listTeam: {
    summary: "List team members",
    description:
      "Returns active team members and pending invites for the company. Requires CARRIER_ADMIN role.",
    tags: ["Team"],
    response: {
      200: {
        type: "array" as const,
        items: TeamMember,
      },
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  invite: {
    summary: "Invite a team member",
    description:
      "Sends an invite for a new team member. Fails if an invite is already pending or user is already in the company. Requires CARRIER_ADMIN role.",
    tags: ["Team"],
    body: zodToSchema(inviteSchema),
    response: {
      200: InviteResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },
};
