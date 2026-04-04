import { db } from "@innovate-test/db";
import { truck } from "@innovate-test/db/schema/truck";
import { task } from "@innovate-test/db/schema/task";
import { routePlan } from "@innovate-test/db/schema/route";
import { demandRequest } from "@innovate-test/db/schema/demand";
import { freightOffer } from "@innovate-test/db/schema/offer";
import { and, eq, count } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireProfile } from "../lib/auth-middleware";
import { dashboardSchemas } from "../lib/schemas/dashboard.schemas";

export async function dashboardRoutes(fastify: FastifyInstance) {
  // GET /dashboard/stats
  fastify.get(
    "/dashboard/stats",
    { schema: dashboardSchemas.getStats, preHandler: [authPreHandler, requireProfile()] },
    async (request) => {
      const { companyId, role, userId } = request.sessionUser;

      // Freelance driver stats
      if (role === "FREELANCE_DRIVER") {
        const [openOffers, activeJobs] = await Promise.all([
          db
            .select({ count: count() })
            .from(freightOffer)
            .where(
              and(
                eq(freightOffer.freelancerUserId, userId),
                eq(freightOffer.status, "open"),
              ),
            ),
          db
            .select({ count: count() })
            .from(freightOffer)
            .where(
              and(
                eq(freightOffer.freelancerUserId, userId),
                eq(freightOffer.status, "accepted"),
              ),
            ),
        ]);

        return {
          openOffers: openOffers[0]?.count ?? 0,
          activeJobs: activeJobs[0]?.count ?? 0,
        };
      }

      // Carrier stats
      if (!companyId) return { error: "No company" };

      const [
        totalTrucks,
        activeTrucks,
        pendingTasks,
        inTransitTasks,
        completedTasks,
        activeRoutes,
        openDemands,
      ] = await Promise.all([
        db
          .select({ count: count() })
          .from(truck)
          .where(eq(truck.companyId, companyId)),
        db
          .select({ count: count() })
          .from(truck)
          .where(and(eq(truck.companyId, companyId), eq(truck.status, "on_road"))),
        db
          .select({ count: count() })
          .from(task)
          .where(and(eq(task.companyId, companyId), eq(task.status, "Pending"))),
        db
          .select({ count: count() })
          .from(task)
          .where(and(eq(task.companyId, companyId), eq(task.status, "InTransit"))),
        db
          .select({ count: count() })
          .from(task)
          .where(and(eq(task.companyId, companyId), eq(task.status, "Completed"))),
        db
          .select({ count: count() })
          .from(routePlan)
          .where(
            and(eq(routePlan.companyId, companyId), eq(routePlan.status, "active")),
          ),
        db
          .select({ count: count() })
          .from(demandRequest)
          .where(
            and(
              eq(demandRequest.companyId, companyId),
              eq(demandRequest.status, "Open"),
            ),
          ),
      ]);

      return {
        totalTrucks: totalTrucks[0]?.count ?? 0,
        activeTrucks: activeTrucks[0]?.count ?? 0,
        pendingTasks: pendingTasks[0]?.count ?? 0,
        inTransitTasks: inTransitTasks[0]?.count ?? 0,
        completedTasks: completedTasks[0]?.count ?? 0,
        activeRoutes: activeRoutes[0]?.count ?? 0,
        openDemands: openDemands[0]?.count ?? 0,
      };
    },
  );
}
