import { db } from "@innovate-test/db";
import { user } from "@innovate-test/db/schema/auth";
import { routeOffer } from "@innovate-test/db/schema/route-offer";
import { routePlan } from "@innovate-test/db/schema/route";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { and, eq, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, notFound } from "../lib/errors";
import { createRouteOffer, notifyUsers } from "../lib/route-offer-helpers";
import { requireCompanyId } from "../lib/zod-schemas";

export async function routeOfferRoutes(fastify: FastifyInstance) {
  const manageRoles = ["CARRIER_ADMIN", "CARRIER_MANAGER"] as const;

  // POST /routes/:routeId/offer — manually offer a route to freelancers
  fastify.post(
    "/routes/:routeId/offer",
    { preHandler: [authPreHandler, requireRole(...manageRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { routeId } = request.params as { routeId: string };

      // Verify route belongs to this company
      const routes = await db
        .select({ id: routePlan.id })
        .from(routePlan)
        .where(and(eq(routePlan.id, routeId), eq(routePlan.companyId, companyId)))
        .limit(1);

      if (!routes[0]) return notFound(reply, "Route not found");

      // Check for existing open offer
      const existing = await db
        .select({ id: routeOffer.id, status: routeOffer.status })
        .from(routeOffer)
        .where(eq(routeOffer.routePlanId, routeId))
        .limit(1);

      if (existing[0]) {
        if (existing[0].status === "open") {
          return badRequest(reply, "Route already has an open offer");
        }
        if (existing[0].status === "accepted") {
          return badRequest(reply, "Route already accepted by a freelancer");
        }
        // cancelled — allow re-offering: fall through
      }

      const offerId = await createRouteOffer(routeId, companyId, "manual");
      return reply.status(201).send({ offerId, routePlanId: routeId, status: "open" });
    },
  );

  // DELETE /routes/:routeId/offer — cancel open offer
  fastify.delete(
    "/routes/:routeId/offer",
    { preHandler: [authPreHandler, requireRole(...manageRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { routeId } = request.params as { routeId: string };

      const offers = await db
        .select()
        .from(routeOffer)
        .where(
          and(
            eq(routeOffer.routePlanId, routeId),
            eq(routeOffer.companyId, companyId),
            eq(routeOffer.status, "open"),
          ),
        )
        .limit(1);

      if (!offers[0]) return notFound(reply, "No open offer found for this route");

      await db
        .update(routeOffer)
        .set({ status: "cancelled" })
        .where(eq(routeOffer.id, offers[0].id));

      return { id: offers[0].id, status: "cancelled" };
    },
  );

  // GET /routes/:routeId/offer — get offer status
  fastify.get(
    "/routes/:routeId/offer",
    { preHandler: [authPreHandler, requireRole(...manageRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { routeId } = request.params as { routeId: string };

      const offers = await db
        .select({
          id: routeOffer.id,
          routePlanId: routeOffer.routePlanId,
          status: routeOffer.status,
          triggerType: routeOffer.triggerType,
          acceptedByDriverId: routeOffer.acceptedByDriverId,
          acceptedAt: routeOffer.acceptedAt,
          createdAt: routeOffer.createdAt,
          driverName: user.name,
          driverEmail: user.email,
        })
        .from(routeOffer)
        .leftJoin(user, eq(routeOffer.acceptedByDriverId, user.id))
        .where(
          and(
            eq(routeOffer.routePlanId, routeId),
            eq(routeOffer.companyId, companyId),
          ),
        )
        .orderBy(routeOffer.createdAt)
        .limit(1);

      if (!offers[0]) return notFound(reply, "No offer found for this route");

      return offers[0];
    },
  );
}
