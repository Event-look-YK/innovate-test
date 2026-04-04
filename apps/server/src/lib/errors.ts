import type { FastifyReply } from "fastify";

export function notFound(reply: FastifyReply, message = "Not found") {
  return reply.status(404).send({ error: message, code: "NOT_FOUND" });
}

export function forbidden(reply: FastifyReply, message = "Forbidden") {
  return reply.status(403).send({ error: message, code: "FORBIDDEN" });
}

export function badRequest(reply: FastifyReply, message: string) {
  return reply.status(400).send({ error: message, code: "BAD_REQUEST" });
}

export function unauthorized(reply: FastifyReply, message = "Unauthorized") {
  return reply.status(401).send({ error: message, code: "UNAUTHORIZED" });
}
