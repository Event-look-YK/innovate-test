import {
  ErrorResponse,
  ConflictResponse,
  paginatedResponse,
  PaginationQuerystring,
} from "./common";

const MarketplaceRouteListItem = {
  type: "object" as const,
  properties: {
    offerId: { type: "string" },
    routePlanId: { type: "string" },
    companyId: { type: "string" },
    companyName: { type: "string" },
    triggerType: { type: "string", enum: ["manual", "auto"] },
    createdAt: { type: "string", format: "date-time" },
    distanceKm: { type: "number" },
    durationHours: { type: "number" },
    loadT: { type: "number" },
    capacityT: { type: "number" },
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
    priority: { type: "string" },
    deadline: { type: "string", format: "date-time" },
  },
};

const MarketplaceRouteDetail = {
  type: "object" as const,
  properties: {
    ...MarketplaceRouteListItem.properties,
    status: { type: "string", enum: ["open", "accepted", "cancelled"] },
    stops: { type: "array" as const, items: RouteStop },
    tasks: { type: "array" as const, items: RouteTask },
  },
};

const AcceptRouteResponse = {
  type: "object" as const,
  properties: {
    offerId: { type: "string" },
    routePlanId: { type: "string" },
    status: { type: "string", enum: ["accepted"] },
  },
};

const OfferIdParams = {
  type: "object" as const,
  properties: {
    offerId: { type: "string", description: "Route offer ID" },
  },
  required: ["offerId"],
};

export const marketplaceSchemas = {
  listRoutes: {
    summary: "List available routes",
    description:
      "Returns a paginated list of open route offers available for freelance drivers to accept. Requires FREELANCE_DRIVER role.",
    tags: ["Marketplace"],
    querystring: PaginationQuerystring,
    response: {
      200: paginatedResponse(MarketplaceRouteListItem),
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  getRoute: {
    summary: "Get route offer details",
    description:
      "Returns full details of a route offer including stops and tasks. Requires FREELANCE_DRIVER role.",
    tags: ["Marketplace"],
    params: OfferIdParams,
    response: {
      200: MarketplaceRouteDetail,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  acceptRoute: {
    summary: "Accept a route offer",
    description:
      "Accepts a route offer (first-come-first-served). The driver is assigned to the route and company staff are notified. Returns 409 if already taken. Requires FREELANCE_DRIVER role.",
    tags: ["Marketplace"],
    params: OfferIdParams,
    response: {
      200: AcceptRouteResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
      409: ConflictResponse,
    },
  },
};
