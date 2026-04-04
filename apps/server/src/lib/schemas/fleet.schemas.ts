import { truckCreateSchema, truckUpdateSchema } from "../zod-schemas";
import {
  zodToSchema,
  ErrorResponse,
  SuccessResponse,
  paginatedResponse,
  PaginationQuerystring,
} from "./common";

const TruckResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    companyId: { type: "string" },
    name: { type: "string" },
    type: { type: "string", enum: ["Truck", "Semi", "Refrigerated", "Flatbed"] },
    payloadT: { type: "number" },
    trailerId: { type: "string", nullable: true },
    trackerId: { type: "string" },
    status: { type: "string", enum: ["idle", "on_road", "maintenance"] },
    locationLabel: { type: "string" },
    locationLat: { type: "number" },
    locationLng: { type: "number" },
    assignedDriverId: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
  },
};

const FleetQuerystring = {
  type: "object" as const,
  properties: {
    ...PaginationQuerystring.properties,
    status: {
      type: "string",
      enum: ["idle", "on_road", "maintenance"],
      description: "Filter by truck status",
    },
    type: {
      type: "string",
      enum: ["Truck", "Semi", "Refrigerated", "Flatbed"],
      description: "Filter by truck type",
    },
  },
};

const TruckIdParams = {
  type: "object" as const,
  properties: {
    truckId: { type: "string", description: "Truck ID" },
  },
  required: ["truckId"],
};

export const fleetSchemas = {
  listFleet: {
    summary: "List company trucks",
    description:
      "Returns a paginated list of trucks belonging to the authenticated user's company. Filterable by status and type. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Fleet"],
    querystring: FleetQuerystring,
    response: {
      200: paginatedResponse(TruckResponse),
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  createTruck: {
    summary: "Add a truck",
    description:
      "Creates a new truck in the authenticated user's company fleet. New trucks start with status 'idle'.",
    tags: ["Fleet"],
    body: zodToSchema(truckCreateSchema),
    response: {
      200: TruckResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  getTruck: {
    summary: "Get truck details",
    description: "Returns details for a specific truck by ID.",
    tags: ["Fleet"],
    params: TruckIdParams,
    response: {
      200: TruckResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  updateTruck: {
    summary: "Update a truck",
    description:
      "Updates fields on an existing truck (name, type, status, location, etc.).",
    tags: ["Fleet"],
    params: TruckIdParams,
    body: zodToSchema(truckUpdateSchema),
    response: {
      200: TruckResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  deleteTruck: {
    summary: "Delete a truck",
    description:
      "Permanently removes a truck. Fails if the truck is assigned to an active route. Requires CARRIER_ADMIN role.",
    tags: ["Fleet"],
    params: TruckIdParams,
    response: {
      200: SuccessResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
