import { db } from "@innovate-test/db";
import { routePlan, routeStop, routePlanTask } from "@innovate-test/db/schema/route";
import { task } from "@innovate-test/db/schema/task";
import { truck } from "@innovate-test/db/schema/truck";
import { and, eq, count, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { parsePagination, paginatedResponse } from "../lib/pagination";
import {
  routeGenerateSchema,
  routeStatusSchema,
  requireCompanyId,
  validateBody,
} from "../lib/zod-schemas";

export async function routeRoutes(fastify: FastifyInstance) {
  const viewRoles = ["CARRIER_ADMIN", "CARRIER_MANAGER", "CARRIER_DRIVER"] as const;

  // GET /routes
  fastify.get(
    "/routes",
    { preHandler: [authPreHandler, requireRole(...viewRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const query = request.query as Record<string, unknown>;
      const pagination = parsePagination(query);

      const conditions = [eq(routePlan.companyId, companyId)];

      if (query.status && typeof query.status === "string") {
        conditions.push(
          eq(routePlan.status, query.status as "draft" | "active" | "completed"),
        );
      }

      // Drivers see only their own routes
      if (request.sessionUser.role === "CARRIER_DRIVER") {
        conditions.push(eq(routePlan.driverId, request.sessionUser.userId));
      }

      const where = and(...conditions);

      const [rows, totalRows] = await Promise.all([
        db
          .select({
            id: routePlan.id,
            truckId: routePlan.truckId,
            truckName: truck.name,
            distanceKm: routePlan.distanceKm,
            durationHours: routePlan.durationHours,
            loadT: routePlan.loadT,
            capacityT: routePlan.capacityT,
            status: routePlan.status,
            createdAt: routePlan.createdAt,
          })
          .from(routePlan)
          .leftJoin(truck, eq(routePlan.truckId, truck.id))
          .where(where)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .orderBy(routePlan.createdAt),
        db.select({ count: count() }).from(routePlan).where(where),
      ]);

      return paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination);
    },
  );

  // POST /routes/generate — greedy route generation
  fastify.post(
    "/routes/generate",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(routeGenerateSchema, request.body, reply);
      if (!data) return;

      // Fetch tasks
      const tasks = await db
        .select()
        .from(task)
        .where(
          and(
            inArray(task.id, data.taskIds),
            eq(task.companyId, companyId),
          ),
        );

      if (tasks.length === 0) {
        return badRequest(reply, "No valid tasks found");
      }

      // Fetch trucks
      const trucks = await db
        .select()
        .from(truck)
        .where(
          and(
            inArray(truck.id, data.truckIds),
            eq(truck.companyId, companyId),
          ),
        );

      if (trucks.length === 0) {
        return badRequest(reply, "No valid trucks found");
      }

      // Greedy assignment: assign tasks to trucks based on capacity
      const assignments: Map<string, typeof tasks> = new Map();
      const truckLoads: Map<string, number> = new Map();

      for (const t of trucks) {
        assignments.set(t.id, []);
        truckLoads.set(t.id, 0);
      }

      const sortedTasks = [...tasks].sort((a, b) => b.weightT - a.weightT);

      for (const t of sortedTasks) {
        // Find truck with most remaining capacity
        let bestTruck: string | null = null;
        let bestRemaining = -1;

        for (const tr of trucks) {
          const currentLoad = truckLoads.get(tr.id) ?? 0;
          const remaining = tr.payloadT - currentLoad;
          if (remaining >= t.weightT && remaining > bestRemaining) {
            bestTruck = tr.id;
            bestRemaining = remaining;
          }
        }

        if (bestTruck) {
          assignments.get(bestTruck)!.push(t);
          truckLoads.set(bestTruck, (truckLoads.get(bestTruck) ?? 0) + t.weightT);
        }
      }

      // Create route plans
      const createdRoutes: Array<{
        id: string;
        truckName: string;
        stops: Array<{ id: string; label: string; eta: Date; note: string | null; sortOrder: number }>;
        distanceKm: number;
        durationHours: number;
        loadT: number;
        capacityT: number;
        status: string;
        createdAt: Date;
      }> = [];

      await db.transaction(async (tx) => {
        for (const tr of trucks) {
          const assignedTasks = assignments.get(tr.id) ?? [];
          if (assignedTasks.length === 0) continue;

          const totalDistance = assignedTasks.reduce((s, t) => s + t.distanceKm, 0);
          const totalWeight = assignedTasks.reduce((s, t) => s + t.weightT, 0);
          const durationHours = Math.round((totalDistance / 60) * 10) / 10;

          const routeId = genId();
          const now = new Date();

          await tx.insert(routePlan).values({
            id: routeId,
            companyId,
            truckId: tr.id,
            driverId: tr.assignedDriverId,
            distanceKm: totalDistance,
            durationHours,
            loadT: totalWeight,
            capacityT: tr.payloadT,
            status: "draft",
          });

          // Create stops from task origins + destinations
          const stops: Array<{ id: string; label: string; eta: Date; note: string | null; sortOrder: number }> = [];
          let order = 0;
          for (const t of assignedTasks) {
            const pickupId = genId();
            stops.push({
              id: pickupId,
              label: t.originLabel,
              eta: t.deadline,
              note: `Pickup: ${t.title}`,
              sortOrder: order++,
            });
            await tx.insert(routeStop).values({
              id: pickupId,
              routePlanId: routeId,
              label: t.originLabel,
              lat: t.originLat,
              lng: t.originLng,
              eta: t.deadline,
              note: `Pickup: ${t.title}`,
              sortOrder: stops.length - 1,
            });

            const deliveryId = genId();
            stops.push({
              id: deliveryId,
              label: t.destinationLabel,
              eta: t.deadline,
              note: `Deliver: ${t.title}`,
              sortOrder: order++,
            });
            await tx.insert(routeStop).values({
              id: deliveryId,
              routePlanId: routeId,
              label: t.destinationLabel,
              lat: t.destinationLat,
              lng: t.destinationLng,
              eta: t.deadline,
              note: `Deliver: ${t.title}`,
              sortOrder: stops.length - 1,
            });

            // Link task to route
            await tx.insert(routePlanTask).values({
              routePlanId: routeId,
              taskId: t.id,
            });

            // Update task status
            await tx
              .update(task)
              .set({ status: "Assigned", assignedTruckId: tr.id })
              .where(eq(task.id, t.id));
          }

          createdRoutes.push({
            id: routeId,
            truckName: tr.name,
            stops,
            distanceKm: totalDistance,
            durationHours,
            loadT: totalWeight,
            capacityT: tr.payloadT,
            status: "draft",
            createdAt: now,
          });
        }
      });

      return createdRoutes;
    },
  );

  // GET /routes/:routeId
  fastify.get(
    "/routes/:routeId",
    { preHandler: [authPreHandler, requireRole(...viewRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { routeId } = request.params as { routeId: string };

      const routes = await db
        .select({
          id: routePlan.id,
          truckId: routePlan.truckId,
          truckName: truck.name,
          driverId: routePlan.driverId,
          distanceKm: routePlan.distanceKm,
          durationHours: routePlan.durationHours,
          loadT: routePlan.loadT,
          capacityT: routePlan.capacityT,
          status: routePlan.status,
          createdAt: routePlan.createdAt,
        })
        .from(routePlan)
        .leftJoin(truck, eq(routePlan.truckId, truck.id))
        .where(and(eq(routePlan.id, routeId), eq(routePlan.companyId, companyId)))
        .limit(1);

      if (!routes[0]) return notFound(reply, "Route not found");

      const [stops, taskLinks] = await Promise.all([
        db
          .select()
          .from(routeStop)
          .where(eq(routeStop.routePlanId, routeId))
          .orderBy(routeStop.sortOrder),
        db
          .select({
            id: task.id,
            title: task.title,
            cargoType: task.cargoType,
            weightT: task.weightT,
            originLabel: task.originLabel,
            destinationLabel: task.destinationLabel,
            status: task.status,
            priority: task.priority,
          })
          .from(routePlanTask)
          .innerJoin(task, eq(routePlanTask.taskId, task.id))
          .where(eq(routePlanTask.routePlanId, routeId)),
      ]);

      return { ...routes[0], stops, tasks: taskLinks };
    },
  );

  // PATCH /routes/:routeId/status
  fastify.patch(
    "/routes/:routeId/status",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { routeId } = request.params as { routeId: string };
      const data = validateBody(routeStatusSchema, request.body, reply);
      if (!data) return;

      const routes = await db
        .select()
        .from(routePlan)
        .where(and(eq(routePlan.id, routeId), eq(routePlan.companyId, companyId)))
        .limit(1);

      const foundRoute = routes[0];
      if (!foundRoute) return notFound(reply, "Route not found");

      const current = foundRoute.status;
      if (
        (current === "draft" && data.status !== "active") ||
        (current === "active" && data.status !== "completed") ||
        current === "completed"
      ) {
        return badRequest(
          reply,
          `Cannot transition from ${current} to ${data.status}`,
        );
      }

      await db.transaction(async (tx) => {
        await tx
          .update(routePlan)
          .set({ status: data.status })
          .where(eq(routePlan.id, routeId));

        if (data.status === "active") {
          // Set truck to on_road
          await tx
            .update(truck)
            .set({ status: "on_road" })
            .where(eq(truck.id, foundRoute.truckId));
        } else if (data.status === "completed") {
          // Set truck back to idle
          await tx
            .update(truck)
            .set({ status: "idle" })
            .where(eq(truck.id, foundRoute.truckId));

          // Mark linked tasks as Completed
          const linkedTasks = await tx
            .select({ taskId: routePlanTask.taskId })
            .from(routePlanTask)
            .where(eq(routePlanTask.routePlanId, routeId));

          for (const lt of linkedTasks) {
            await tx
              .update(task)
              .set({ status: "Completed" })
              .where(eq(task.id, lt.taskId));
          }
        }
      });

      return { id: routeId, status: data.status };
    },
  );
}
