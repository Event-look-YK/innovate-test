import { routeGenerateSchema, routeStatusSchema } from "../zod-schemas";
import {
  zodToSchema,
  ErrorResponse,
  paginatedResponse,
  PaginationQuerystring,
} from "./common";

const RouteListItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    truckId: { type: "string" },
    truckName: { type: "string", nullable: true },
    distanceKm: { type: "number" },
    durationHours: { type: "number" },
    loadT: { type: "number" },
    capacityT: { type: "number" },
    status: { type: "string", enum: ["draft", "active", "completed"] },
    createdAt: { type: "string", format: "date-time" },
  },
};

const RouteStop = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    routePlanId: { type: "string" },
    label: { type: "string" },
    lat: { type: "number" },
    lng: { type: "number" },
    eta: { type: "string", format: "date-time" },
    note: { type: "string", nullable: true },
    sortOrder: { type: "number" },
  },
};

const RouteTask = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    cargoType: { type: "string" },
    weightT: { type: "number" },
    originLabel: { type: "string" },
    destinationLabel: { type: "string" },
    status: { type: "string" },
    priority: { type: "string" },
  },
};

const RouteDetailResponse = {
  type: "object" as const,
  properties: {
    ...RouteListItem.properties,
    driverId: { type: "string", nullable: true },
    stops: { type: "array" as const, items: RouteStop },
    tasks: { type: "array" as const, items: RouteTask },
  },
};

const GeneratedRoute = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    truckName: { type: "string" },
    distanceKm: { type: "number" },
    durationHours: { type: "number" },
    loadT: { type: "number" },
    capacityT: { type: "number" },
    status: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    stops: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          eta: { type: "string", format: "date-time" },
          note: { type: "string", nullable: true },
          sortOrder: { type: "number" },
        },
      },
    },
  },
};

const PlanStats = {
  type: "object" as const,
  properties: {
    total_distance_km: { type: "number" },
    total_cost_uah: { type: "number" },
    total_empty_km: { type: "number" },
    trucks_used: { type: "number" },
    trucks_idle: { type: "number" },
    avg_utilization_pct: { type: "number" },
  },
  required: [
    "total_distance_km",
    "total_cost_uah",
    "total_empty_km",
    "trucks_used",
    "trucks_idle",
    "avg_utilization_pct",
  ] as const,
};

const RouteGenerateResponse = {
  type: "object" as const,
  properties: {
    plan: PlanStats,
    routes: { type: "array" as const, items: GeneratedRoute },
    unassigned: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          task_id: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    warnings: { type: "array" as const, items: { type: "string" } },
  },
};

const RoutesQuerystring = {
  type: "object" as const,
  properties: {
    ...PaginationQuerystring.properties,
    status: {
      type: "string",
      enum: ["draft", "active", "completed"],
      description: "Filter by route status",
    },
  },
};

const RouteIdParams = {
  type: "object" as const,
  properties: {
    routeId: { type: "string", description: "Route plan ID" },
  },
  required: ["routeId"],
};

const RouteStatusUpdateResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    status: { type: "string", enum: ["active", "completed"] },
  },
};

export const routeSchemas = {
  listRoutes: {
    summary: "List routes",
    description:
      "Returns a paginated list of route plans for the company. Filterable by status. Drivers only see their assigned routes.",
    tags: ["Routes"],
    querystring: RoutesQuerystring,
    response: {
      200: paginatedResponse(RouteListItem),
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  generateRoutes: {
    summary: "Generate optimized routes",
    description:
      "Uses LLM-based optimization to assign tasks to trucks and create optimal routes. Created routes start in 'draft' status. If all company trucks become busy, routes are automatically offered to freelancers.",
    tags: ["Routes"],
    body: zodToSchema(routeGenerateSchema),
    response: {
      200: RouteGenerateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      502: {
        type: "object" as const,
        properties: { error: { type: "string" } },
        description: "LLM optimization failed",
      },
    },
  },

  getRoute: {
    summary: "Get route details",
    description:
      "Returns a route plan with its stops and linked tasks.",
    tags: ["Routes"],
    params: RouteIdParams,
    response: {
      200: RouteDetailResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  updateRouteStatus: {
    summary: "Update route status",
    description:
      "Transitions route status: draft → active (sets truck to on_road) or active → completed (sets truck to idle, marks tasks as Completed). Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Routes"],
    params: RouteIdParams,
    body: zodToSchema(routeStatusSchema),
    response: {
      200: RouteStatusUpdateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
