import { zodToJsonSchema } from "zod-to-json-schema";
import {ZodSchema} from "zod/v3";

export function zodToSchema(schema: ZodSchema) {
  const result = zodToJsonSchema(schema, { target: "jsonSchema7" });
  // Remove top-level $schema key that openapi doesn't need
  if ("$schema" in result) {
    const { $schema, ...rest } = result;
    return rest;
  }
  return result;
}

// Matches the shape from lib/errors.ts
export const ErrorResponse = {
  type: "object" as const,
  properties: {
    error: { type: "string" },
    code: {
      type: "string",
      enum: ["BAD_REQUEST", "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND"],
    },
  },
  required: ["error", "code"],
};

export const ConflictResponse = {
  type: "object" as const,
  properties: {
    error: { type: "string" },
    code: { type: "string", enum: ["CONFLICT"] },
  },
  required: ["error", "code"],
};

export const SuccessResponse = {
  type: "object" as const,
  properties: {
    success: { type: "boolean" },
  },
};

export const PaginationMeta = {
  type: "object" as const,
  properties: {
    page: { type: "number" },
    limit: { type: "number" },
    total: { type: "number" },
    totalPages: { type: "number" },
  },
};

export function paginatedResponse(itemSchema: Record<string, unknown>) {
  return {
    type: "object" as const,
    properties: {
      data: { type: "array" as const, items: itemSchema },
      meta: PaginationMeta,
    },
  };
}

export const PaginationQuerystring = {
  type: "object" as const,
  properties: {
    page: { type: "number", default: 1, description: "Page number (1-based)" },
    limit: {
      type: "number",
      default: 20,
      maximum: 100,
      description: "Items per page (max 100)",
    },
  },
};
