import { db } from "@innovate-test/db";
import { demandRequest } from "@innovate-test/db/schema/demand";
import { task } from "@innovate-test/db/schema/task";
import { freightOffer } from "@innovate-test/db/schema/offer";
import { and, eq, count } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { parsePagination, paginatedResponse } from "../lib/pagination";
import { demandSchemas } from "../lib/schemas/demand.schemas";
import {
  demandCreateSchema,
  requireCompanyId,
  validateBody,
} from "../lib/zod-schemas";

export async function demandRoutes(fastify: FastifyInstance) {
  // GET /demand
  fastify.get(
    "/demand",
    { schema: demandSchemas.listDemand, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const query = request.query as Record<string, unknown>;
      const pagination = parsePagination(query);

      const conditions = [eq(demandRequest.companyId, companyId)];
      if (query.status && typeof query.status === "string") {
        conditions.push(
          eq(
            demandRequest.status,
            query.status as "Open" | "Offers sent" | "Accepted" | "In progress" | "Completed",
          ),
        );
      }

      const where = and(...conditions);

      const [rows, totalRows] = await Promise.all([
        db
          .select({
            id: demandRequest.id,
            taskId: demandRequest.taskId,
            taskTitle: task.title,
            requiredTruckType: demandRequest.requiredTruckType,
            cargoType: demandRequest.cargoType,
            payloadT: demandRequest.payloadT,
            originLabel: demandRequest.originLabel,
            destinationLabel: demandRequest.destinationLabel,
            distanceKm: demandRequest.distanceKm,
            budgetUah: demandRequest.budgetUah,
            deadline: demandRequest.deadline,
            status: demandRequest.status,
            createdAt: demandRequest.createdAt,
          })
          .from(demandRequest)
          .leftJoin(task, eq(demandRequest.taskId, task.id))
          .where(where)
          .limit(pagination.limit)
          .offset(pagination.offset)
          .orderBy(demandRequest.createdAt),
        db.select({ count: count() }).from(demandRequest).where(where),
      ]);

      return paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination);
    },
  );

  // POST /demand
  fastify.post(
    "/demand",
    { schema: demandSchemas.createDemand, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const companyId = requireCompanyId(request, reply);
      if (!companyId) return;

      const data = validateBody(demandCreateSchema, request.body, reply);
      if (!data) return;

      // Verify task belongs to company if provided
      if (data.taskId) {
        const t = await db
          .select({ id: task.id })
          .from(task)
          .where(and(eq(task.id, data.taskId), eq(task.companyId, companyId)))
          .limit(1);
        if (!t[0]) return badRequest(reply, "Task not found in your company");
      }

      const id = genId();
      const row = {
        id,
        companyId,
        taskId: data.taskId ?? null,
        requiredTruckType: data.requiredTruckType,
        cargoType: data.cargoType,
        payloadT: data.payloadT,
        originLabel: data.originLabel,
        originLat: data.originLat,
        originLng: data.originLng,
        destinationLabel: data.destinationLabel,
        destinationLat: data.destinationLat,
        destinationLng: data.destinationLng,
        distanceKm: data.distanceKm,
        deadline: new Date(data.deadline),
        budgetUah: data.budgetUah,
        status: "Open" as const,
      };

      await db.insert(demandRequest).values(row);
      return row;
    },
  );

  // GET /demand/:requestId
  fastify.get(
    "/demand/:requestId",
    {
      schema: demandSchemas.getDemand,
      preHandler: [
        authPreHandler,
        requireRole("CARRIER_ADMIN", "CARRIER_MANAGER", "FREELANCE_DRIVER"),
      ],
    },
    async (request, reply) => {
      const { requestId } = request.params as { requestId: string };
      const { role, companyId } = request.sessionUser;

      const rows = await db
        .select({
          id: demandRequest.id,
          companyId: demandRequest.companyId,
          taskId: demandRequest.taskId,
          taskTitle: task.title,
          requiredTruckType: demandRequest.requiredTruckType,
          cargoType: demandRequest.cargoType,
          payloadT: demandRequest.payloadT,
          originLabel: demandRequest.originLabel,
          destinationLabel: demandRequest.destinationLabel,
          distanceKm: demandRequest.distanceKm,
          budgetUah: demandRequest.budgetUah,
          deadline: demandRequest.deadline,
          status: demandRequest.status,
          createdAt: demandRequest.createdAt,
        })
        .from(demandRequest)
        .leftJoin(task, eq(demandRequest.taskId, task.id))
        .where(eq(demandRequest.id, requestId))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Demand request not found");

      // Carrier users can only see their own company's demands
      if (role !== "FREELANCE_DRIVER" && rows[0].companyId !== companyId) {
        return notFound(reply, "Demand request not found");
      }

      // Freelancers can only see open demands
      if (role === "FREELANCE_DRIVER" && rows[0].status !== "Open") {
        return notFound(reply, "Demand request not found");
      }

      // Count offers
      const offerCount = await db
        .select({ count: count() })
        .from(freightOffer)
        .where(eq(freightOffer.demandRequestId, requestId));

      return { ...rows[0], offerCount: offerCount[0]?.count ?? 0 };
    },
  );
}
