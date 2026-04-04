import { db } from "@innovate-test/db";
import { company } from "@innovate-test/db/schema/company";
import { notification } from "@innovate-test/db/schema/notification";
import { routePlan, routeStop, routePlanTask } from "@innovate-test/db/schema/route";
import { routeOffer } from "@innovate-test/db/schema/route-offer";
import { task } from "@innovate-test/db/schema/task";
import { userProfile } from "@innovate-test/db/schema/user-profile";
import { and, count, eq, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { parsePagination, paginatedResponse } from "../lib/pagination";
import { marketplaceSchemas } from "../lib/schemas/marketplace.schemas";

export async function marketplaceRoutes(fastify: FastifyInstance) {
  // GET /marketplace/routes — list open route offers
  fastify.get(
    "/marketplace/routes",
    { schema: marketplaceSchemas.listRoutes, preHandler: [authPreHandler, requireRole("FREELANCE_DRIVER")] },
    async (request) => {
      const pagination = parsePagination(request.query as Record<string, unknown>);

      const [rows, totalRows] = await Promise.all([
        db
          .select({
            offerId: routeOffer.id,
            routePlanId: routeOffer.routePlanId,
            companyId: routeOffer.companyId,
            companyName: company.name,
            triggerType: routeOffer.triggerType,
            createdAt: routeOffer.createdAt,
            distanceKm: routePlan.distanceKm,
            durationHours: routePlan.durationHours,
            loadT: routePlan.loadT,
            capacityT: routePlan.capacityT,
          })
          .from(routeOffer)
          .innerJoin(routePlan, eq(routeOffer.routePlanId, routePlan.id))
          .innerJoin(company, eq(routeOffer.companyId, company.id))
          .where(eq(routeOffer.status, "open"))
          .limit(pagination.limit)
          .offset(pagination.offset)
          .orderBy(routeOffer.createdAt),
        db
          .select({ count: count() })
          .from(routeOffer)
          .where(eq(routeOffer.status, "open")),
      ]);

      return paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination);
    },
  );

  // GET /marketplace/routes/:offerId — get full offer detail
  fastify.get(
    "/marketplace/routes/:offerId",
    { schema: marketplaceSchemas.getRoute, preHandler: [authPreHandler, requireRole("FREELANCE_DRIVER")] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };

      const offers = await db
        .select({
          offerId: routeOffer.id,
          status: routeOffer.status,
          routePlanId: routeOffer.routePlanId,
          companyId: routeOffer.companyId,
          companyName: company.name,
          triggerType: routeOffer.triggerType,
          createdAt: routeOffer.createdAt,
          distanceKm: routePlan.distanceKm,
          durationHours: routePlan.durationHours,
          loadT: routePlan.loadT,
          capacityT: routePlan.capacityT,
        })
        .from(routeOffer)
        .innerJoin(routePlan, eq(routeOffer.routePlanId, routePlan.id))
        .innerJoin(company, eq(routeOffer.companyId, company.id))
        .where(eq(routeOffer.id, offerId))
        .limit(1);

      if (!offers[0]) return notFound(reply, "Offer not found");
      const offer = offers[0];

      const [stops, tasks] = await Promise.all([
        db
          .select()
          .from(routeStop)
          .where(eq(routeStop.routePlanId, offer.routePlanId))
          .orderBy(routeStop.sortOrder),
        db
          .select({
            id: task.id,
            title: task.title,
            cargoType: task.cargoType,
            weightT: task.weightT,
            originLabel: task.originLabel,
            destinationLabel: task.destinationLabel,
            priority: task.priority,
            deadline: task.deadline,
          })
          .from(routePlanTask)
          .innerJoin(task, eq(routePlanTask.taskId, task.id))
          .where(eq(routePlanTask.routePlanId, offer.routePlanId)),
      ]);

      return { ...offer, stops, tasks };
    },
  );

  // POST /marketplace/routes/:offerId/accept — first-come-first-served accept
  fastify.post(
    "/marketplace/routes/:offerId/accept",
    { schema: marketplaceSchemas.acceptRoute, preHandler: [authPreHandler, requireRole("FREELANCE_DRIVER")] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };
      const driverId = request.sessionUser.userId;
      const driverName = request.sessionUser.name;

      let accepted: { routePlanId: string; companyId: string } | null = null;

      try {
        accepted = await db.transaction(async (tx) => {
          // Check offer is still open (row-level lock via update)
          const offers = await tx
            .select()
            .from(routeOffer)
            .where(and(eq(routeOffer.id, offerId), eq(routeOffer.status, "open")))
            .limit(1);

          if (!offers[0]) return null;

          const offer = offers[0];
          const now = new Date();

          await tx
            .update(routeOffer)
            .set({ status: "accepted", acceptedByDriverId: driverId, acceptedAt: now })
            .where(eq(routeOffer.id, offerId));

          await tx
            .update(routePlan)
            .set({ driverId })
            .where(eq(routePlan.id, offer.routePlanId));

          return { routePlanId: offer.routePlanId, companyId: offer.companyId };
        });
      } catch {
        return reply
          .status(409)
          .send({ error: "Route already accepted by another driver", code: "CONFLICT" });
      }

      if (!accepted) {
        // Offer exists but isn't open — distinguish not found vs conflict
        const anyOffer = await db
          .select({ status: routeOffer.status })
          .from(routeOffer)
          .where(eq(routeOffer.id, offerId))
          .limit(1);

        if (!anyOffer[0]) return notFound(reply, "Offer not found");
        return reply
          .status(409)
          .send({ error: "Route already accepted or cancelled", code: "CONFLICT" });
      }

      // Notify company admins/managers
      const companyStaff = await db
        .select({ userId: userProfile.userId })
        .from(userProfile)
        .where(
          and(
            eq(userProfile.companyId, accepted.companyId),
            inArray(userProfile.role, ["CARRIER_ADMIN", "CARRIER_MANAGER"]),
          ),
        );

      if (companyStaff.length > 0) {
        await db.insert(notification).values(
          companyStaff.map((s) => ({
            id: genId(),
            userId: s.userId,
            type: "route_offer_accepted",
            title: "Маршрут прийнятий фрілансером",
            body: `${driverName} прийняв(ла) маршрут.`,
            data: {
              routeOfferId: offerId,
              routePlanId: accepted!.routePlanId,
              driverName,
              driverId,
            },
          })),
        );
      }

      return reply.send({
        offerId,
        routePlanId: accepted.routePlanId,
        status: "accepted",
      });
    },
  );
}
