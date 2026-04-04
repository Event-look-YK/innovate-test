import { ErrorResponse } from "./common";

const RouteIdParams = {
  type: "object" as const,
  properties: {
    routeId: { type: "string", description: "Route plan ID" },
  },
  required: ["routeId"],
};

const RouteOfferResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    routePlanId: { type: "string" },
    status: { type: "string", enum: ["open", "accepted", "cancelled"] },
    triggerType: { type: "string", enum: ["manual", "auto"] },
    acceptedByDriverId: { type: "string", nullable: true },
    acceptedAt: { type: "string", format: "date-time", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    driverName: { type: "string", nullable: true },
    driverEmail: { type: "string", nullable: true },
  },
};

const CreateOfferResponse = {
  type: "object" as const,
  properties: {
    offerId: { type: "string" },
    routePlanId: { type: "string" },
    status: { type: "string", enum: ["open"] },
  },
};

const CancelOfferResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    status: { type: "string", enum: ["cancelled"] },
  },
};

export const routeOfferSchemas = {
  createOffer: {
    summary: "Offer a route to freelancers",
    description:
      "Manually creates a route offer visible to freelance drivers in the marketplace. Fails if route already has an open or accepted offer. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Route Offers"],
    params: RouteIdParams,
    response: {
      201: CreateOfferResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  cancelOffer: {
    summary: "Cancel a route offer",
    description:
      "Cancels an open route offer. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Route Offers"],
    params: RouteIdParams,
    response: {
      200: CancelOfferResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  getOffer: {
    summary: "Get route offer status",
    description:
      "Returns the most recent offer for a route, including driver info if accepted. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Route Offers"],
    params: RouteIdParams,
    response: {
      200: RouteOfferResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
