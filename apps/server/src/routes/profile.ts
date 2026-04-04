import { db } from "@innovate-test/db";
import { company } from "@innovate-test/db/schema/company";
import { teamInvite } from "@innovate-test/db/schema/team-invite";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { user } from "@innovate-test/db/schema/auth";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler } from "../lib/auth-middleware";
import { badRequest } from "../lib/errors";
import { genId } from "../lib/id";
import { profileSchemas } from "../lib/schemas/profile.schemas";
import {
  onboardSchema,
  profileUpdateSchema,
  validateBody,
} from "../lib/zod-schemas";

export async function profileRoutes(fastify: FastifyInstance) {
  // GET /profile/me
  fastify.get(
    "/profile/me",
    { schema: profileSchemas.getMe, preHandler: [authPreHandler] },
    async (request) => {
      return request.sessionUser;
    },
  );

  // POST /profile — update name, phone, language
  fastify.post(
    "/profile",
    { schema: profileSchemas.updateProfile, preHandler: [authPreHandler] },
    async (request, reply) => {
      const data = validateBody(profileUpdateSchema, request.body, reply);
      if (!data) return;

      const { userId } = request.sessionUser;

      await db
        .update(user)
        .set({ name: data.fullName })
        .where(eq(user.id, userId));

      const existing = await db
        .select({ id: userProfile.id })
        .from(userProfile)
        .where(eq(userProfile.userId, userId))
        .limit(1);

      if (!existing[0]) {
        return badRequest(reply, "Profile not found. Complete onboarding first.");
      }

      await db
        .update(userProfile)
        .set({ phone: data.phone, language: data.language })
        .where(eq(userProfile.userId, userId));

      return { success: true };
    },
  );

  // POST /profile/onboard — create company + profile (carrier) or profile only (freelance)
  fastify.post(
    "/profile/onboard",
    { schema: profileSchemas.onboard, preHandler: [authPreHandler] },
    async (request, reply) => {
      if (request.sessionUser.profileComplete) {
        return badRequest(reply, "Already onboarded");
      }

      const data = validateBody(onboardSchema, request.body, reply);
      if (!data) return;

      const { userId, email } = request.sessionUser;

      if (data.role === "CARRIER_ADMIN") {
        // Check for pending invite — if found, join existing company instead
        const pending = await db
          .select()
          .from(teamInvite)
          .where(eq(teamInvite.email, email))
          .limit(1);

        const pendingInvite = pending[0];
        if (pendingInvite && pendingInvite.status === "invited") {
          // Join existing company with the invited role
          const profileId = genId();
          await db.transaction(async (tx) => {
            await tx.insert(userProfile).values({
              id: profileId,
              userId,
              role: pendingInvite.role,
              companyId: pendingInvite.companyId,
              language: "uk",
            });
            await tx
              .update(teamInvite)
              .set({ status: "accepted", acceptedUserId: userId, acceptedAt: new Date() })
              .where(eq(teamInvite.id, pendingInvite.id));
          });
          return { profileId, companyId: pendingInvite.companyId };
        }

        // Create new company + profile
        const companyId = genId();
        const profileId = genId();

        await db.transaction(async (tx) => {
          await tx.insert(company).values({
            id: companyId,
            name: data.companyName,
            taxId: data.taxId,
            country: data.country,
            city: data.city,
          });
          await tx.insert(userProfile).values({
            id: profileId,
            userId,
            role: "CARRIER_ADMIN",
            companyId,
            language: "uk",
          });
        });

        return { companyId, profileId };
      }

      // FREELANCE_DRIVER
      const profileId = genId();
      await db.insert(userProfile).values({
        id: profileId,
        userId,
        role: "FREELANCE_DRIVER",
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
        payloadT: data.payloadT,
        language: "uk",
      });

      return { profileId };
    },
  );
}
