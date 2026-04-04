import { db } from "@innovate-test/db";
import { teamInvite } from "@innovate-test/db/schema/team-invite";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { user } from "@innovate-test/db/schema/auth";
import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest } from "../lib/errors";
import { genId } from "../lib/id";
import { inviteSchema, requireCompanyId, validateBody } from "../lib/zod-schemas";

export async function teamRoutes(fastify: FastifyInstance) {
  // GET /team — active members + pending invites
  fastify.get(
    "/team",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      // Active members
      const members = await db
        .select({
          id: userProfile.id,
          name: user.name,
          email: user.email,
          role: userProfile.role,
          invitedAt: userProfile.createdAt,
        })
        .from(userProfile)
        .innerJoin(user, eq(userProfile.userId, user.id))
        .where(eq(userProfile.companyId, companyId));

      const activeMembers = members.map((m) => ({
        ...m,
        status: "active" as const,
      }));

      // Pending invites
      const invites = await db
        .select({
          id: teamInvite.id,
          name: teamInvite.fullName,
          email: teamInvite.email,
          role: teamInvite.role,
          invitedAt: teamInvite.invitedAt,
        })
        .from(teamInvite)
        .where(
          and(
            eq(teamInvite.companyId, companyId),
            eq(teamInvite.status, "invited"),
          ),
        );

      const pendingInvites = invites.map((i) => ({
        ...i,
        status: "invited" as const,
      }));

      return [...activeMembers, ...pendingInvites];
    },
  );

  // POST /team/invite
  fastify.post(
    "/team/invite",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(inviteSchema, request.body, reply);
      if (!data) return;

      // Check for existing pending invite
      const existingInvite = await db
        .select({ id: teamInvite.id })
        .from(teamInvite)
        .where(
          and(
            eq(teamInvite.companyId, companyId),
            eq(teamInvite.email, data.email),
            eq(teamInvite.status, "invited"),
          ),
        )
        .limit(1);

      if (existingInvite[0]) {
        return badRequest(reply, "An invite is already pending for this email");
      }

      // Check if user is already in the company
      const existingUser = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, data.email))
        .limit(1);

      if (existingUser[0]) {
        const existingProfile = await db
          .select({ id: userProfile.id })
          .from(userProfile)
          .where(
            and(
              eq(userProfile.userId, existingUser[0].id),
              eq(userProfile.companyId, companyId),
            ),
          )
          .limit(1);

        if (existingProfile[0]) {
          return badRequest(reply, "User is already a member of this company");
        }
      }

      const id = genId();
      await db.insert(teamInvite).values({
        id,
        companyId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        invitedById: request.sessionUser.userId,
      });

      return {
        id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        status: "invited",
      };
    },
  );
}
