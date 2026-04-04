import { db } from "@innovate-test/db";
import { truck } from "@innovate-test/db/schema/truck";
import { routePlan } from "@innovate-test/db/schema/route";
import { and, eq, count } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { parsePagination, paginatedResponse } from "../lib/pagination";
import {
  truckCreateSchema,
  truckUpdateSchema,
  requireCompanyId,
  validateBody,
} from "../lib/zod-schemas";

export async function fleetRoutes(fastify: FastifyInstance) {
  const fleetRoles = ["CARRIER_ADMIN", "CARRIER_MANAGER"] as const;

  // GET /fleet
  fastify.get(
    "/fleet",
    { preHandler: [authPreHandler, requireRole(...fleetRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const query = request.query as Record<string, unknown>;
      const pagination = parsePagination(query);

      const conditions = [eq(truck.companyId, companyId)];
      if (query.status && typeof query.status === "string") {
        conditions.push(eq(truck.status, query.status as "idle" | "on_road" | "maintenance"));
      }
      if (query.type && typeof query.type === "string") {
        conditions.push(eq(truck.type, query.type as "Truck" | "Semi" | "Refrigerated" | "Flatbed"));
      }

      const where = and(...conditions);

      const [rows, totalRows] = await Promise.all([
        db
          .select()
          .from(truck)
          .where(where)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .orderBy(truck.createdAt),
        db.select({ count: count() }).from(truck).where(where),
      ]);

      return paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination);
    },
  );

  // POST /fleet
  fastify.post(
    "/fleet",
    { preHandler: [authPreHandler, requireRole(...fleetRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(truckCreateSchema, request.body, reply);
      if (!data) return;

      const id = genId();
      const row = {
        id,
        companyId,
        name: data.name,
        type: data.type,
        payloadT: data.payloadT,
        trailerId: data.trailerId ?? null,
        trackerId: data.trackerId,
        status: "idle" as const,
        locationLabel: data.locationLabel,
        locationLat: data.locationLat ?? 0,
        locationLng: data.locationLng ?? 0,
      };

      await db.insert(truck).values(row);
      return row;
    },
  );

  // GET /fleet/:truckId
  fastify.get(
    "/fleet/:truckId",
    { preHandler: [authPreHandler, requireRole(...fleetRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { truckId } = request.params as { truckId: string };

      const rows = await db
        .select()
        .from(truck)
        .where(and(eq(truck.id, truckId), eq(truck.companyId, companyId)))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Truck not found");
      return rows[0];
    },
  );

  // PUT /fleet/:truckId
  fastify.put(
    "/fleet/:truckId",
    { preHandler: [authPreHandler, requireRole(...fleetRoles)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { truckId } = request.params as { truckId: string };
      const data = validateBody(truckUpdateSchema, request.body, reply);
      if (!data) return;

      const existing = await db
        .select({ id: truck.id })
        .from(truck)
        .where(and(eq(truck.id, truckId), eq(truck.companyId, companyId)))
        .limit(1);

      if (!existing[0]) return notFound(reply, "Truck not found");

      const updates: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) updates[key] = val;
      }

      if (Object.keys(updates).length === 0) {
        return badRequest(reply, "No fields to update");
      }

      await db
        .update(truck)
        .set(updates)
        .where(eq(truck.id, truckId));

      const updated = await db
        .select()
        .from(truck)
        .where(eq(truck.id, truckId))
        .limit(1);

      return updated[0];
    },
  );

  // DELETE /fleet/:truckId
  fastify.delete(
    "/fleet/:truckId",
    { preHandler: [authPreHandler, requireRole("CARRIER_ADMIN")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { truckId } = request.params as { truckId: string };

      const existing = await db
        .select({ id: truck.id })
        .from(truck)
        .where(and(eq(truck.id, truckId), eq(truck.companyId, companyId)))
        .limit(1);

      if (!existing[0]) return notFound(reply, "Truck not found");

      // Check if truck is assigned to an active route
      const activeRoute = await db
        .select({ id: routePlan.id })
        .from(routePlan)
        .where(and(eq(routePlan.truckId, truckId), eq(routePlan.status, "active")))
        .limit(1);

      if (activeRoute[0]) {
        return badRequest(reply, "Truck is assigned to an active route");
      }

      await db.delete(truck).where(eq(truck.id, truckId));
      return { success: true };
    },
  );
}
