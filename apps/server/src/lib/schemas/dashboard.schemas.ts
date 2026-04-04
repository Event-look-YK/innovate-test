import { ErrorResponse } from "./common";

const CarrierStatsResponse = {
  type: "object" as const,
  properties: {
    totalTrucks: { type: "number" },
    activeTrucks: { type: "number" },
    pendingTasks: { type: "number" },
    inTransitTasks: { type: "number" },
    completedTasks: { type: "number" },
    activeRoutes: { type: "number" },
    openDemands: { type: "number" },
  },
  description: "Returned for carrier roles",
};

const FreelancerStatsResponse = {
  type: "object" as const,
  properties: {
    openOffers: { type: "number" },
    activeJobs: { type: "number" },
  },
  description: "Returned for FREELANCE_DRIVER role",
};

export const dashboardSchemas = {
  getStats: {
    summary: "Get dashboard statistics",
    description:
      "Returns aggregated statistics. Response shape differs by role: carriers get fleet/task/route counts, freelancers get offer/job counts.",
    tags: ["Dashboard"],
    response: {
      200: {
        oneOf: [CarrierStatsResponse, FreelancerStatsResponse],
      },
      401: ErrorResponse,
    },
  },
};
