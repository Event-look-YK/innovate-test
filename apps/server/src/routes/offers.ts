import { db } from "@innovate-test/db";
import { freightOffer } from "@innovate-test/db/schema/offer";
import { demandRequest } from "@innovate-test/db/schema/demand";
import { task } from "@innovate-test/db/schema/task";
import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler, requireRole } from "../lib/auth-middleware";
import { badRequest, forbidden, notFound } from "../lib/errors";
import { genId } from "../lib/id";
import { offerSchemas } from "../lib/schemas/offers.schemas";
import {
  offerCreateSchema,
  offerCounterSchema,
  validateBody,
} from "../lib/zod-schemas";

export async function offerRoutes(fastify: FastifyInstance) {
  // GET /offers
  fastify.get(
    "/offers",
    { schema: offerSchemas.listOffers, preHandler: [authPreHandler] },
    async (request, reply) => {
      const { role, userId, companyId } = request.sessionUser;

      if (role === "FREELANCE_DRIVER") {
        // Freelancer sees own offers
        const rows = await db
          .select({
            id: freightOffer.id,
            demandRequestId: freightOffer.demandRequestId,
            taskTitle: task.title,
            originLabel: demandRequest.originLabel,
            destinationLabel: demandRequest.destinationLabel,
            distanceKm: demandRequest.distanceKm,
            cargoType: demandRequest.cargoType,
            weightT: demandRequest.payloadT,
            deadline: demandRequest.deadline,
            offeredPriceUah: freightOffer.offeredPriceUah,
            status: freightOffer.status,
            createdAt: freightOffer.createdAt,
          })
          .from(freightOffer)
          .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
          .leftJoin(task, eq(demandRequest.taskId, task.id))
          .where(eq(freightOffer.freelancerUserId, userId))
          .orderBy(freightOffer.createdAt);

        return rows;
      }

      if (role === "CARRIER_ADMIN" || role === "CARRIER_MANAGER") {
        if (!companyId) return badRequest(reply, "No company associated");

        const query = request.query as Record<string, unknown>;
        const conditions = [eq(demandRequest.companyId, companyId)];

        if (query.demandRequestId && typeof query.demandRequestId === "string") {
          conditions.push(eq(freightOffer.demandRequestId, query.demandRequestId));
        }

        const rows = await db
          .select({
            id: freightOffer.id,
            demandRequestId: freightOffer.demandRequestId,
            freelancerUserId: freightOffer.freelancerUserId,
            taskTitle: task.title,
            originLabel: demandRequest.originLabel,
            destinationLabel: demandRequest.destinationLabel,
            distanceKm: demandRequest.distanceKm,
            cargoType: demandRequest.cargoType,
            weightT: demandRequest.payloadT,
            deadline: demandRequest.deadline,
            offeredPriceUah: freightOffer.offeredPriceUah,
            estimatedHours: freightOffer.estimatedHours,
            note: freightOffer.note,
            status: freightOffer.status,
            createdAt: freightOffer.createdAt,
          })
          .from(freightOffer)
          .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
          .leftJoin(task, eq(demandRequest.taskId, task.id))
          .where(and(...conditions))
          .orderBy(freightOffer.createdAt);

        return rows;
      }

      return forbidden(reply);
    },
  );

  // POST /offers — freelancer creates an offer
  fastify.post(
    "/offers",
    { schema: offerSchemas.createOffer, preHandler: [authPreHandler, requireRole("FREELANCE_DRIVER")] },
    async (request, reply) => {
      const data = validateBody(offerCreateSchema, request.body, reply);
      if (!data) return;

      const { userId } = request.sessionUser;

      // Verify demand exists and is open
      const demand = await db
        .select({ id: demandRequest.id, status: demandRequest.status })
        .from(demandRequest)
        .where(eq(demandRequest.id, data.demandRequestId))
        .limit(1);

      if (!demand[0]) return notFound(reply, "Demand request not found");
      if (demand[0].status !== "Open" && demand[0].status !== "Offers sent") {
        return badRequest(reply, "Demand request is not accepting offers");
      }

      // Check for duplicate offer
      const existing = await db
        .select({ id: freightOffer.id })
        .from(freightOffer)
        .where(
          and(
            eq(freightOffer.demandRequestId, data.demandRequestId),
            eq(freightOffer.freelancerUserId, userId),
            eq(freightOffer.status, "open"),
          ),
        )
        .limit(1);

      if (existing[0]) {
        return badRequest(reply, "You already have an open offer for this demand");
      }

      const id = genId();
      await db.insert(freightOffer).values({
        id,
        demandRequestId: data.demandRequestId,
        freelancerUserId: userId,
        offeredPriceUah: data.offeredPriceUah,
        estimatedHours: data.estimatedHours ?? null,
        note: data.note ?? null,
        status: "open",
      });

      // Update demand status to "Offers sent" if it was "Open"
      if (demand[0].status === "Open") {
        await db
          .update(demandRequest)
          .set({ status: "Offers sent" })
          .where(eq(demandRequest.id, data.demandRequestId));
      }

      return { id, status: "open" };
    },
  );

  // GET /offers/:offerId
  fastify.get(
    "/offers/:offerId",
    { schema: offerSchemas.getOffer, preHandler: [authPreHandler] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };
      const { role, userId, companyId } = request.sessionUser;

      const rows = await db
        .select({
          id: freightOffer.id,
          demandRequestId: freightOffer.demandRequestId,
          freelancerUserId: freightOffer.freelancerUserId,
          offeredPriceUah: freightOffer.offeredPriceUah,
          estimatedHours: freightOffer.estimatedHours,
          note: freightOffer.note,
          status: freightOffer.status,
          createdAt: freightOffer.createdAt,
          demandCompanyId: demandRequest.companyId,
          taskTitle: task.title,
          originLabel: demandRequest.originLabel,
          destinationLabel: demandRequest.destinationLabel,
          distanceKm: demandRequest.distanceKm,
          cargoType: demandRequest.cargoType,
          weightT: demandRequest.payloadT,
          deadline: demandRequest.deadline,
          budgetUah: demandRequest.budgetUah,
        })
        .from(freightOffer)
        .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
        .leftJoin(task, eq(demandRequest.taskId, task.id))
        .where(eq(freightOffer.id, offerId))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Offer not found");

      // Authorization: freelancer who made the offer or carrier who owns the demand
      if (role === "FREELANCE_DRIVER" && rows[0].freelancerUserId !== userId) {
        return forbidden(reply);
      }
      if (
        role !== "FREELANCE_DRIVER" &&
        rows[0].demandCompanyId !== companyId
      ) {
        return forbidden(reply);
      }

      return rows[0];
    },
  );

  // POST /offers/:offerId/accept
  fastify.post(
    "/offers/:offerId/accept",
    { schema: offerSchemas.acceptOffer, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };
      const { companyId } = request.sessionUser;

      const offer = await db
        .select({
          id: freightOffer.id,
          demandRequestId: freightOffer.demandRequestId,
          demandCompanyId: demandRequest.companyId,
          status: freightOffer.status,
        })
        .from(freightOffer)
        .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
        .where(eq(freightOffer.id, offerId))
        .limit(1);

      const found = offer[0];
      if (!found) return notFound(reply, "Offer not found");
      if (found.demandCompanyId !== companyId) return forbidden(reply);
      if (found.status !== "open") {
        return badRequest(reply, "Offer is not open");
      }

      await db.transaction(async (tx) => {
        // Accept this offer
        await tx
          .update(freightOffer)
          .set({ status: "accepted" })
          .where(eq(freightOffer.id, offerId));

        // Decline all other open offers for the same demand
        await tx
          .update(freightOffer)
          .set({ status: "declined" })
          .where(
            and(
              eq(freightOffer.demandRequestId, found.demandRequestId),
              eq(freightOffer.status, "open"),
            ),
          );

        // Update demand status
        await tx
          .update(demandRequest)
          .set({ status: "Accepted" })
          .where(eq(demandRequest.id, found.demandRequestId));
      });

      return { success: true, offerId };
    },
  );

  // POST /offers/:offerId/decline
  fastify.post(
    "/offers/:offerId/decline",
    { schema: offerSchemas.declineOffer, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };
      const { companyId } = request.sessionUser;

      const offer = await db
        .select({
          id: freightOffer.id,
          demandCompanyId: demandRequest.companyId,
          status: freightOffer.status,
        })
        .from(freightOffer)
        .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
        .where(eq(freightOffer.id, offerId))
        .limit(1);

      if (!offer[0]) return notFound(reply, "Offer not found");
      if (offer[0].demandCompanyId !== companyId) return forbidden(reply);
      if (offer[0].status !== "open") {
        return badRequest(reply, "Offer is not open");
      }

      await db
        .update(freightOffer)
        .set({ status: "declined" })
        .where(eq(freightOffer.id, offerId));

      return { success: true };
    },
  );

  // POST /offers/:offerId/counter
  fastify.post(
    "/offers/:offerId/counter",
    { schema: offerSchemas.counterOffer, preHandler: [authPreHandler, requireRole("CARRIER_ADMIN", "CARRIER_MANAGER")] },
    async (request, reply) => {
      const { offerId } = request.params as { offerId: string };
      const { companyId } = request.sessionUser;

      const data = validateBody(offerCounterSchema, request.body, reply);
      if (!data) return;

      const offer = await db
        .select({
          id: freightOffer.id,
          demandCompanyId: demandRequest.companyId,
          status: freightOffer.status,
        })
        .from(freightOffer)
        .innerJoin(demandRequest, eq(freightOffer.demandRequestId, demandRequest.id))
        .where(eq(freightOffer.id, offerId))
        .limit(1);

      if (!offer[0]) return notFound(reply, "Offer not found");
      if (offer[0].demandCompanyId !== companyId) return forbidden(reply);

      await db
        .update(freightOffer)
        .set({
          offeredPriceUah: data.offeredPriceUah,
          note: data.note ?? null,
          status: "open",
        })
        .where(eq(freightOffer.id, offerId));

      const updated = await db
        .select()
        .from(freightOffer)
        .where(eq(freightOffer.id, offerId))
        .limit(1);

      return updated[0];
    },
  );
}
