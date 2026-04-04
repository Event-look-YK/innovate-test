import { db } from "@innovate-test/db";
import { thread, threadParticipant, message } from "@innovate-test/db/schema/message";
import { user } from "@innovate-test/db/schema/auth";
import { task } from "@innovate-test/db/schema/task";
import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

import { authPreHandler } from "../lib/auth-middleware";
import { badRequest, forbidden } from "../lib/errors";
import { genId } from "../lib/id";
import {
  threadCreateSchema,
  messageCreateSchema,
  validateBody,
} from "../lib/zod-schemas";

export async function messageRoutes(fastify: FastifyInstance) {
  // GET /messages/threads
  fastify.get(
    "/messages/threads",
    { preHandler: [authPreHandler] },
    async (request) => {
      const { userId } = request.sessionUser;

      const rows = await db
        .select({
          id: thread.id,
          type: thread.type,
          title: thread.title,
          lastMessage: thread.lastMessage,
          updatedAt: thread.updatedAt,
        })
        .from(thread)
        .innerJoin(threadParticipant, eq(thread.id, threadParticipant.threadId))
        .where(eq(threadParticipant.userId, userId))
        .orderBy(thread.updatedAt);

      return rows;
    },
  );

  // POST /messages/threads
  fastify.post(
    "/messages/threads",
    { preHandler: [authPreHandler] },
    async (request, reply) => {
      const data = validateBody(threadCreateSchema, request.body, reply);
      if (!data) return;

      const { userId, companyId } = request.sessionUser;

      // Validate task belongs to company if task thread
      if (data.type === "task") {
        if (!data.taskId) return badRequest(reply, "taskId required for task threads");
        if (companyId) {
          const t = await db
            .select({ id: task.id })
            .from(task)
            .where(and(eq(task.id, data.taskId), eq(task.companyId, companyId)))
            .limit(1);
          if (!t[0]) return badRequest(reply, "Task not found");
        }
      }

      const threadId = genId();

      await db.transaction(async (tx) => {
        await tx.insert(thread).values({
          id: threadId,
          companyId: companyId,
          type: data.type,
          title: data.title,
          taskId: data.taskId ?? null,
        });

        // Add creator as participant
        await tx.insert(threadParticipant).values({
          id: genId(),
          threadId,
          userId,
        });

        // Add other participants
        if (data.participantIds) {
          for (const pid of data.participantIds) {
            if (pid !== userId) {
              await tx.insert(threadParticipant).values({
                id: genId(),
                threadId,
                userId: pid,
              });
            }
          }
        }
      });

      return { id: threadId, type: data.type, title: data.title };
    },
  );

  // GET /messages/threads/:threadId
  fastify.get(
    "/messages/threads/:threadId",
    { preHandler: [authPreHandler] },
    async (request, reply) => {
      const { threadId } = request.params as { threadId: string };
      const { userId } = request.sessionUser;

      // Verify participation
      const participant = await db
        .select({ id: threadParticipant.id })
        .from(threadParticipant)
        .where(
          and(
            eq(threadParticipant.threadId, threadId),
            eq(threadParticipant.userId, userId),
          ),
        )
        .limit(1);

      if (!participant[0]) return forbidden(reply, "Not a participant of this thread");

      const messages = await db
        .select({
          id: message.id,
          threadId: message.threadId,
          author: user.name,
          authorId: message.authorId,
          body: message.body,
          sentAt: message.sentAt,
          status: message.status,
        })
        .from(message)
        .innerJoin(user, eq(message.authorId, user.id))
        .where(eq(message.threadId, threadId))
        .orderBy(message.sentAt);

      return messages;
    },
  );

  // POST /messages
  fastify.post(
    "/messages",
    { preHandler: [authPreHandler] },
    async (request, reply) => {
      const data = validateBody(messageCreateSchema, request.body, reply);
      if (!data) return;

      const { userId } = request.sessionUser;

      // Verify participation
      const participant = await db
        .select({ id: threadParticipant.id })
        .from(threadParticipant)
        .where(
          and(
            eq(threadParticipant.threadId, data.threadId),
            eq(threadParticipant.userId, userId),
          ),
        )
        .limit(1);

      if (!participant[0]) return forbidden(reply, "Not a participant of this thread");

      const id = genId();

      await db.transaction(async (tx) => {
        await tx.insert(message).values({
          id,
          threadId: data.threadId,
          authorId: userId,
          body: data.body,
          status: "sent",
        });

        await tx
          .update(thread)
          .set({ lastMessage: data.body })
          .where(eq(thread.id, data.threadId));
      });

      return { id, threadId: data.threadId, body: data.body, status: "sent" };
    },
  );
}
