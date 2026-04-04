import { offerCreateSchema, offerCounterSchema } from "../zod-schemas";
import { zodToSchema, ErrorResponse, SuccessResponse } from "./common";

const FreelancerOfferListItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    demandRequestId: { type: "string" },
    taskTitle: { type: "string", nullable: true },
    originLabel: { type: "string" },
    destinationLabel: { type: "string" },
    distanceKm: { type: "number" },
    cargoType: { type: "string" },
    weightT: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    offeredPriceUah: { type: "number" },
    status: { type: "string", enum: ["open", "accepted", "declined"] },
    createdAt: { type: "string", format: "date-time" },
  },
};

const CarrierOfferListItem = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    demandRequestId: { type: "string" },
    freelancerUserId: { type: "string" },
    taskTitle: { type: "string", nullable: true },
    originLabel: { type: "string" },
    destinationLabel: { type: "string" },
    distanceKm: { type: "number" },
    cargoType: { type: "string" },
    weightT: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    offeredPriceUah: { type: "number" },
    estimatedHours: { type: "number", nullable: true },
    note: { type: "string", nullable: true },
    status: { type: "string", enum: ["open", "accepted", "declined"] },
    createdAt: { type: "string", format: "date-time" },
  },
};

const OfferDetailResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    demandRequestId: { type: "string" },
    freelancerUserId: { type: "string" },
    offeredPriceUah: { type: "number" },
    estimatedHours: { type: "number", nullable: true },
    note: { type: "string", nullable: true },
    status: { type: "string", enum: ["open", "accepted", "declined"] },
    createdAt: { type: "string", format: "date-time" },
    demandCompanyId: { type: "string" },
    taskTitle: { type: "string", nullable: true },
    originLabel: { type: "string" },
    destinationLabel: { type: "string" },
    distanceKm: { type: "number" },
    cargoType: { type: "string" },
    weightT: { type: "number" },
    deadline: { type: "string", format: "date-time" },
    budgetUah: { type: "number" },
  },
};

const OfferCreateResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    status: { type: "string", enum: ["open"] },
  },
};

const AcceptResponse = {
  type: "object" as const,
  properties: {
    success: { type: "boolean" },
    offerId: { type: "string" },
  },
};

const FullOfferResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    demandRequestId: { type: "string" },
    freelancerUserId: { type: "string" },
    offeredPriceUah: { type: "number" },
    estimatedHours: { type: "number", nullable: true },
    note: { type: "string", nullable: true },
    status: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
};

const OfferIdParams = {
  type: "object" as const,
  properties: {
    offerId: { type: "string", description: "Offer ID" },
  },
  required: ["offerId"],
};

const OffersQuerystring = {
  type: "object" as const,
  properties: {
    demandRequestId: {
      type: "string",
      description: "Filter by demand request ID (carrier view only)",
    },
  },
};

export const offerSchemas = {
  listOffers: {
    summary: "List offers",
    description:
      "Freelancers see their own offers. Carriers see offers for their company's demands, optionally filtered by demandRequestId.",
    tags: ["Offers"],
    querystring: OffersQuerystring,
    response: {
      200: {
        oneOf: [
          { type: "array" as const, items: FreelancerOfferListItem },
          { type: "array" as const, items: CarrierOfferListItem },
        ],
      },
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },

  createOffer: {
    summary: "Create an offer",
    description:
      "Freelancer submits an offer for an open demand request. Only one open offer per freelancer per demand is allowed. Requires FREELANCE_DRIVER role.",
    tags: ["Offers"],
    body: zodToSchema(offerCreateSchema),
    response: {
      200: OfferCreateResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  getOffer: {
    summary: "Get offer details",
    description:
      "Returns full offer details including demand info. Freelancers can only see their own offers; carriers can only see offers for their company's demands.",
    tags: ["Offers"],
    params: OfferIdParams,
    response: {
      200: OfferDetailResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  acceptOffer: {
    summary: "Accept an offer",
    description:
      "Accepts a freelancer's offer, declines all other open offers for the same demand, and updates demand status to 'Accepted'. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Offers"],
    params: OfferIdParams,
    response: {
      200: AcceptResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  declineOffer: {
    summary: "Decline an offer",
    description:
      "Declines a freelancer's offer. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Offers"],
    params: OfferIdParams,
    response: {
      200: SuccessResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },

  counterOffer: {
    summary: "Counter an offer",
    description:
      "Updates the offer price and note as a counter-offer. The offer remains in 'open' status. Requires CARRIER_ADMIN or CARRIER_MANAGER role.",
    tags: ["Offers"],
    params: OfferIdParams,
    body: zodToSchema(offerCounterSchema),
    response: {
      200: FullOfferResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
    },
  },
};
