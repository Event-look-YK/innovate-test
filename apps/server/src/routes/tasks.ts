import { db } from "@innovate-test/db";
import { task } from "@innovate-test/db/schema/task";
import { truck } from "@innovate-test/db/schema/truck";
import { and, eq, count, inArray } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { parsePagination, paginatedResponse } from "../lib/pagination";
import { taskSchemas } from "../lib/schemas/tasks.schemas";
import {
  taskCreateSchema,
  taskUpdateSchema,
  taskStatusSchema,
  requireCompanyId,
  validateBody,
} from "../lib/zod-schemas";

const VALID_TRANSITIONS: Record<string, string[]> = {
  Pending: ["Assigned"],
  Assigned: ["InTransit"],
  InTransit: ["Delivered"],
  Delivered: ["Completed"],
};

export async function taskRoutes(fastify: FastifyInstance) {
  const allCarrier = [
    "CARRIER_ADMIN",
    "CARRIER_MANAGER",
    "CARRIER_DRIVER",
    "CARRIER_WAREHOUSE_MANAGER",
  ] as const;

  // GET /tasks
  fastify.get(
    "/tasks",
    { schema: taskSchemas.listTasks, preHandler: [authPreHandler, requireRole(...allCarrier)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const query = request.query as Record<string, unknown>;
      const pagination = parsePagination(query);

      const conditions = [eq(task.companyId, companyId)];

      if (query.status && typeof query.status === "string") {
        conditions.push(
          eq(task.status, query.status as "Pending" | "Assigned" | "InTransit" | "Delivered" | "Completed"),
        );
      }
      if (query.priority && typeof query.priority === "string") {
        conditions.push(
          eq(task.priority, query.priority as "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY"),
        );
      }

      // Drivers only see tasks assigned to their trucks
      if (request.sessionUser.role === "CARRIER_DRIVER") {
        const driverTrucks = await db
          .select({ id: truck.id })
          .from(truck)
          .where(eq(truck.assignedDriverId, request.sessionUser.userId));

        const truckIds = driverTrucks.map((t) => t.id);
        if (truckIds.length === 0) {
          return paginatedResponse([], 0, pagination);
        }
        conditions.push(inArray(task.assignedTruckId, truckIds));
      }

      const where = and(...conditions);

      const [rows, totalRows] = await Promise.all([
        db
          .select()
          .from(task)
          .where(where)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .orderBy(task.createdAt),
        db.select({ count: count() }).from(task).where(where),
      ]);

      return paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination);
    },
  );

  // POST /tasks
  fastify.post(
    "/tasks",
    {
      schema: taskSchemas.createTask,
      preHandler: [
        authPreHandler,
        requireRole("CARRIER_ADMIN", "CARRIER_MANAGER", "CARRIER_WAREHOUSE_MANAGER"),
      ],
    },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(taskCreateSchema, request.body, reply);
      if (!data) return;

      // Verify truck belongs to company if assigned
      if (data.assignedTruckId) {
        const t = await db
          .select({ id: truck.id })
          .from(truck)
          .where(and(eq(truck.id, data.assignedTruckId), eq(truck.companyId, companyId)))
          .limit(1);
        if (!t[0]) return badRequest(reply, "Truck not found in your company");
      }

      const id = genId();
      const row = {
        id,
        companyId,
        title: data.title,
        cargoDescription: data.cargoDescription,
        cargoType: data.cargoType,
        weightT: data.weightT,
        originLabel: data.originLabel,
        originLat: data.originLat,
        originLng: data.originLng,
        destinationLabel: data.destinationLabel,
        destinationLat: data.destinationLat,
        destinationLng: data.destinationLng,
        distanceKm: data.distanceKm,
        deadline: new Date(data.deadline),
        priority: data.priority,
        status: data.assignedTruckId ? ("Assigned" as const) : ("Pending" as const),
        assignedTruckId: data.assignedTruckId ?? null,
        notes: data.notes ?? null,
        createdById: request.sessionUser.userId,
      };

      await db.insert(task).values(row);
      return row;
    },
  );

  // GET /tasks/:taskId
  fastify.get(
    "/tasks/:taskId",
    { schema: taskSchemas.getTask, preHandler: [authPreHandler, requireRole(...allCarrier)] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { taskId } = request.params as { taskId: string };

      const rows = await db
        .select()
        .from(task)
        .where(and(eq(task.id, taskId), eq(task.companyId, companyId)))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Task not found");
      return rows[0];
    },
  );

  // PUT /tasks/:taskId
  fastify.put(
    "/tasks/:taskId",
    { schema: taskSchemas.updateTask, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { taskId } = request.params as { taskId: string };
      const data = validateBody(taskUpdateSchema, request.body, reply);
      if (!data) return;

      const existing = await db
        .select({ id: task.id })
        .from(task)
        .where(and(eq(task.id, taskId), eq(task.companyId, companyId)))
        .limit(1);

      if (!existing[0]) return notFound(reply, "Task not found");

      if (data.assignedTruckId) {
        const t = await db
          .select({ id: truck.id })
          .from(truck)
          .where(and(eq(truck.id, data.assignedTruckId), eq(truck.companyId, companyId)))
          .limit(1);
        if (!t[0]) return badRequest(reply, "Truck not found in your company");
      }

      const updates: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) {
          updates[key] = key === "deadline" ? new Date(val as string) : val;
        }
      }

      if (Object.keys(updates).length === 0) {
        return badRequest(reply, "No fields to update");
      }

      await db.update(task).set(updates).where(eq(task.id, taskId));

      const updated = await db
        .select()
        .from(task)
        .where(eq(task.id, taskId))
        .limit(1);

      return updated[0];
    },
  );

  // PATCH /tasks/:taskId/status
  fastify.patch(
    "/tasks/:taskId/status",
    {
      schema: taskSchemas.updateTaskStatus,
      preHandler: [
        authPreHandler,
        requireRole("CARRIER_ADMIN", "CARRIER_MANAGER", "CARRIER_DRIVER"),
      ],
    },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const { taskId } = request.params as { taskId: string };
      const data = validateBody(taskStatusSchema, request.body, reply);
      if (!data) return;

      const rows = await db
        .select()
        .from(task)
        .where(and(eq(task.id, taskId), eq(task.companyId, companyId)))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Task not found");

      const currentStatus = rows[0].status;
      const allowed = VALID_TRANSITIONS[currentStatus];

      if (!allowed || !allowed.includes(data.status)) {
        return badRequest(
          reply,
          `Cannot transition from ${currentStatus} to ${data.status}`,
        );
      }

      // Drivers can only do Assigned->InTransit and InTransit->Delivered
      if (request.sessionUser.role === "CARRIER_DRIVER") {
        const driverAllowed =
          (currentStatus === "Assigned" && data.status === "InTransit") ||
          (currentStatus === "InTransit" && data.status === "Delivered");
        if (!driverAllowed) {
          return forbidden(reply, "Drivers can only update to InTransit or Delivered");
        }
      }

      // Assigned requires a truck
      if (data.status === "Assigned" && !rows[0].assignedTruckId) {
        return badRequest(reply, "Cannot assign without a truck");
      }

      await db
        .update(task)
        .set({ status: data.status })
        .where(eq(task.id, taskId));

      return { id: taskId, status: data.status };
    },
  );
}
