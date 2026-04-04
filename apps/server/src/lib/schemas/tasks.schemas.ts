import { taskCreateSchema, taskUpdateSchema, taskStatusSchema } from "../zod-schemas";
import {
  zodToSchema,
  ErrorResponse,
  paginatedResponse,
  PaginationQuerystring,
} from "./common";

const TaskResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    companyId: { type: "string" },
    title: { type: "string" },
    cargoDescription: { type: "string" },
    cargoType: { type: "string", enum: ["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"] },
    weightT: { type: "number" },
    originLabel: { type: "string" },
    originLat: { type: "number" },
    originLng: { type: "number" },
    destinationLabel: { type: "string" },
    destinationLat: { type: "number" },
    destinationLng: { type: "number" },
    distanceKm: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] },
    status: { type: "string", enum: ["Pending", "Assigned", "InTransit", "Delivered", "Completed"] },
    assignedTruckId: { type: "string", nullable: true },
    notes: { type: "string", nullable: true },
    createdById: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
};

const TasksQuerystring = {
  type: "object" as const,
  properties: {
    ...PaginationQuerystring.properties,
    status: {
      type: "string",
      enum: ["Pending", "Assigned", "InTransit", "Delivered", "Completed"],
      description: "Filter by task status",
    },
    priority: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH", "EMERGENCY"],
      description: "Filter by priority",
    },
  },
};

const TaskIdParams = {
  type: "object" as const,
  properties: {
    taskId: { type: "string", description: "Task ID" },
  },
  required: ["taskId"],
};

const TaskStatusUpdateResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    status: { type: "string", enum: ["Pending", "Assigned", "InTransit", "Delivered", "Completed"] },
  },
};

export const taskSchemas = {
  listTasks: {
    summary: "List tasks",
    description:
      "Returns a paginated list of tasks for the company. Filterable by status and priority. Drivers only see tasks assigned to their trucks.",
    tags: ["Tasks"],
    querystring: TasksQuerystring,
    response: {
      200: paginatedResponse(TaskResponse),
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  createTask: {
    summary: "Create a task",
    description:
      "Creates a new cargo task. If assignedTruckId is provided, the task starts as 'Assigned'; otherwise 'Pending'. Requires CARRIER_ADMIN, CARRIER_MANAGER, or CARRIER_WAREHOUSE_MANAGER role.",
    tags: ["Tasks"],
    body: zodToSchema(taskCreateSchema),
    response: {
      200: TaskResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  getTask: {
    summary: "Get task details",
    description: "Returns details for a specific task by ID.",
    tags: ["Tasks"],
    params: TaskIdParams,
    response: {
      200: TaskResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  updateTask: {
    summary: "Update a task",
    description:
      "Updates task fields. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Tasks"],
    params: TaskIdParams,
    body: zodToSchema(taskUpdateSchema),
    response: {
      200: TaskResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  updateTaskStatus: {
    summary: "Update task status",
    description:
      "Transitions task status following valid transitions: Pending → Assigned → InTransit → Delivered → Completed. Drivers can only update to InTransit or Delivered.",
    tags: ["Tasks"],
    params: TaskIdParams,
    body: zodToSchema(taskStatusSchema),
    response: {
      200: TaskStatusUpdateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
