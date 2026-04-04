import { demandCreateSchema } from "../zod-schemas";
import {
  zodToSchema,
  ErrorResponse,
  paginatedResponse,
  PaginationQuerystring,
} from "./common";

const DemandListItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    taskId: { type: "string", nullable: true },
    taskTitle: { type: "string", nullable: true },
    requiredTruckType: { type: "string", enum: ["Truck", "Semi", "Refrigerated", "Flatbed"] },
    cargoType: { type: "string", enum: ["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"] },
    payloadT: { type: "number" },
    originLabel: { type: "string" },
    destinationLabel: { type: "string" },
    distanceKm: { type: "number" },
    budgetUah: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["Open", "Offers sent", "Accepted", "In progress", "Completed"] },
    createdAt: { type: "string", format: "date-time" },
  },
};

const DemandDetailResponse = {
  type: "object" as const,
  properties: {
    ...DemandListItem.properties,
    companyId: { type: "string" },
    offerCount: { type: "number", description: "Number of offers received" },
  },
};

const DemandCreateResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    companyId: { type: "string" },
    taskId: { type: "string", nullable: true },
    requiredTruckType: { type: "string" },
    cargoType: { type: "string" },
    payloadT: { type: "number" },
    originLabel: { type: "string" },
    originLat: { type: "number" },
    originLng: { type: "number" },
    destinationLabel: { type: "string" },
    destinationLat: { type: "number" },
    destinationLng: { type: "number" },
    distanceKm: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    budgetUah: { type: "number" },
    status: { type: "string", enum: ["Open"] },
  },
};

const DemandQuerystring = {
  type: "object" as const,
  properties: {
    ...PaginationQuerystring.properties,
    status: {
      type: "string",
      enum: ["Open", "Offers sent", "Accepted", "In progress", "Completed"],
      description: "Filter by demand status",
    },
  },
};

const RequestIdParams = {
  type: "object" as const,
  properties: {
    requestId: { type: "string", description: "Demand request ID" },
  },
  required: ["requestId"],
};

export const demandSchemas = {
  listDemand: {
    summary: "List demand requests",
    description:
      "Returns a paginated list of freight demand requests for the company. Filterable by status. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Demand"],
    querystring: DemandQuerystring,
    response: {
      200: paginatedResponse(DemandListItem),
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  createDemand: {
    summary: "Create a demand request",
    description:
      "Creates a new freight demand request. Optionally links to an existing task. Starts with 'Open' status.",
    tags: ["Demand"],
    body: zodToSchema(demandCreateSchema),
    response: {
      200: DemandCreateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  getDemand: {
    summary: "Get demand request details",
    description:
      "Returns demand details including offer count. Carriers see only their company's demands. Freelancers can only see open demands.",
    tags: ["Demand"],
    params: RequestIdParams,
    response: {
      200: DemandDetailResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
