import { profileUpdateSchema, onboardSchema } from "../zod-schemas";
import { zodToSchema, ErrorResponse, SuccessResponse } from "./common";

const SessionUserResponse = {
  type: "object" as const,
  properties: {
    userId: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    role: { type: "string", nullable: true },
    companyId: { type: "string", nullable: true },
    companyName: { type: "string", nullable: true },
    profileComplete: { type: "boolean" },
    phone: { type: "string", nullable: true },
    language: { type: "string" },
  },
};

const OnboardResponse = {
  type: "object" as const,
  properties: {
    profileId: { type: "string" },
    companyId: { type: "string", description: "Only present for CARRIER_ADMIN" },
  },
};

export const profileSchemas = {
  getMe: {
    summary: "Get current user profile",
    description:
      "Returns the session user object including role, company, and profile completion status.",
    tags: ["Profile"],
    response: {
      200: SessionUserResponse,
      401: ErrorResponse,
    },
  },

  updateProfile: {
    summary: "Update user profile",
    description:
      "Updates the authenticated user's name, phone, and language. Requires completed onboarding.",
    tags: ["Profile"],
    body: zodToSchema(profileUpdateSchema),
    response: {
      200: SuccessResponse,
      400: ErrorResponse,
      401: ErrorResponse,
    },
  },

  onboard: {
    summary: "Complete onboarding",
    description:
      'Creates a company + profile for CARRIER_ADMIN role, or a freelance driver profile for FREELANCE_DRIVER role. If a pending team invite exists for the email, the user joins the existing company instead. Can only be called once (returns 400 if already onboarded).',
    tags: ["Profile"],
    body: zodToSchema(onboardSchema),
    response: {
      200: OnboardResponse,
      400: ErrorResponse,
      401: ErrorResponse,
    },
  },
};
