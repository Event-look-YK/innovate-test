import { db } from "@innovate-test/db";
import { notification } from "@innovate-test/db/schema/notification";
import { and, count, eq, isNull } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler } from "../lib/auth-middleware";
import { notFound } from "../lib/errors";
import { parsePagination, paginatedResponse } from "../lib/pagination";

export async function notificationRoutes(fastify: FastifyInstance) {
  // GET /notifications — list own notifications (newest first)
  fastify.get(
    "/notifications",
    { preHandler: [authPreHandler] },
    async (request) => {
      const userId = request.sessionUser.userId;
      const pagination = parsePagination(request.query as Record<string, unknown>);

      const [rows, totalRows] = await Promise.all([
        db
          .select()
          .from(notification)
          .where(eq(notification.userId, userId))
          .orderBy(notification.createdAt)
          .limit(pagination.limit)
          .offset(pagination.offset),
        db
          .select({ count: count() })
          .from(notification)
          .where(eq(notification.userId, userId)),
      ]);

      // Unread count
      const unread = await db
        .select({ count: count() })
        .from(notification)
        .where(and(eq(notification.userId, userId), isNull(notification.readAt)));

      return {
        ...paginatedResponse(rows, totalRows[0]?.count ?? 0, pagination),
        unreadCount: unread[0]?.count ?? 0,
      };
    },
  );

  // PATCH /notifications/:id/read — mark one as read
  fastify.patch(
    "/notifications/:id/read",
    { preHandler: [authPreHandler] },
    async (request, reply) => {
      const userId = request.sessionUser.userId;
      const { id } = request.params as { id: string };

      const rows = await db
        .select({ id: notification.id })
        .from(notification)
        .where(and(eq(notification.id, id), eq(notification.userId, userId)))
        .limit(1);

      if (!rows[0]) return notFound(reply, "Notification not found");

      await db
        .update(notification)
        .set({ readAt: new Date() })
        .where(eq(notification.id, id));

      return { id, readAt: new Date().toISOString() };
    },
  );

  // POST /notifications/read-all — mark all as read
  fastify.post(
    "/notifications/read-all",
    { preHandler: [authPreHandler] },
    async (request) => {
      const userId = request.sessionUser.userId;

      await db
        .update(notification)
        .set({ readAt: new Date() })
        .where(and(eq(notification.userId, userId), isNull(notification.readAt)));

      return { ok: true };
    },
  );
}
