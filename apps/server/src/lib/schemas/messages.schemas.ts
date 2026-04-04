import { threadCreateSchema, messageCreateSchema } from "../zod-schemas";
import { zodToSchema, ErrorResponse } from "./common";

const ThreadListItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    type: { type: "string", enum: ["task", "direct", "group"] },
    title: { type: "string" },
    lastMessage: { type: "string", nullable: true },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const ThreadCreateResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    type: { type: "string", enum: ["task", "direct", "group"] },
    title: { type: "string" },
  },
};

const MessageResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    threadId: { type: "string" },
    author: { type: "string" },
    authorId: { type: "string" },
    body: { type: "string" },
    sentAt: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["sent", "read"] },
  },
};

const SendMessageResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    threadId: { type: "string" },
    body: { type: "string" },
    status: { type: "string", enum: ["sent"] },
  },
};

const ThreadIdParams = {
  type: "object" as const,
  properties: {
    threadId: { type: "string", description: "Thread ID" },
  },
  required: ["threadId"],
};

export const messageSchemas = {
  listThreads: {
    summary: "List message threads",
    description:
      "Returns all message threads the authenticated user participates in, ordered by last update.",
    tags: ["Messages"],
    response: {
      200: { type: "array" as const, items: ThreadListItem },
      401: ErrorResponse,
    },
  },

  createThread: {
    summary: "Create a message thread",
    description:
      "Creates a new thread (task, direct, or group). The creator is automatically added as a participant. For task threads, taskId is required.",
    tags: ["Messages"],
    body: zodToSchema(threadCreateSchema),
    response: {
      200: ThreadCreateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
    },
  },

  getThread: {
    summary: "Get messages in a thread",
    description:
      "Returns all messages in a thread, ordered by sent time. Only accessible to thread participants.",
    tags: ["Messages"],
    params: ThreadIdParams,
    response: {
      200: { type: "array" as const, items: MessageResponse },
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  sendMessage: {
    summary: "Send a message",
    description:
      "Sends a message to a thread. Only thread participants can send messages.",
    tags: ["Messages"],
    body: zodToSchema(messageCreateSchema),
    response: {
      200: SendMessageResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },
};
