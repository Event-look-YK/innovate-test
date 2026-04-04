import { ErrorResponse, paginatedResponse, PaginationQuerystring } from "./common";

const NotificationItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    type: { type: "string" },
    title: { type: "string" },
    body: { type: "string" },
    data: { type: "object" as const, additionalProperties: true },
    readAt: { type: "string", format: "date-time", nullable: true },
    createdAt: { type: "string", format: "date-time" },
  },
};

const NotificationListResponse = {
  type: "object" as const,
  properties: {
    data: { type: "array" as const, items: NotificationItem },
    meta: {
      type: "object" as const,
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        total: { type: "number" },
        totalPages: { type: "number" },
      },
    },
    unreadCount: { type: "number" },
  },
};

const MarkReadResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    readAt: { type: "string", format: "date-time" },
  },
};

const NotificationIdParams = {
  type: "object" as const,
  properties: {
    id: { type: "string", description: "Notification ID" },
  },
  required: ["id"],
};

export const notificationSchemas = {
  list: {
    summary: "List notifications",
    description:
      "Returns a paginated list of notifications for the authenticated user, with an unread count.",
    tags: ["Notifications"],
    querystring: PaginationQuerystring,
    response: {
      200: NotificationListResponse,
      401: ErrorResponse,
    },
  },

  markRead: {
    summary: "Mark notification as read",
    description: "Marks a single notification as read.",
    tags: ["Notifications"],
    params: NotificationIdParams,
    response: {
      200: MarkReadResponse,
      401: ErrorResponse,
      404: ErrorResponse,
    },
  },

  readAll: {
    summary: "Mark all notifications as read",
    description: "Marks all unread notifications as read for the authenticated user.",
    tags: ["Notifications"],
    response: {
      200: {
        type: "object" as const,
        properties: { ok: { type: "boolean" } },
      },
      401: ErrorResponse,
    },
  },
};
