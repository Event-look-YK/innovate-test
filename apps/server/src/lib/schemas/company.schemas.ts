import { companyUpdateSchema } from "../zod-schemas";
import { zodToSchema, ErrorResponse } from "./common";

const CompanyResponse = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    taxId: { type: "string" },
    country: { type: "string" },
    city: { type: "string" },
    logoUrl: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
  },
};

export const companySchemas = {
  getCompany: {
    summary: "Get company details",
    description:
      "Returns the company associated with the authenticated user.",
    tags: ["Company"],
    response: {
      200: CompanyResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      404: ErrorResponse,
    },
  },

  updateCompany: {
    summary: "Update company",
    description:
      "Updates company fields (name, taxId, country, city, logoUrl). Requires CARRIER_ADMIN role.",
    tags: ["Company"],
    body: zodToSchema(companyUpdateSchema),
    response: {
      200: CompanyResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
    },
  },
};
