import type { FastifyReply } from "fastify";
import { z } from "zod/v3";

import type { FastifyRequest } from "fastify";
import { badRequest } from "./errors";

// ── Helpers ──────────────────────────────────────────────────────────

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
  reply: FastifyReply,
): T | null {
  const result = schema.safeParse(body);
  if (!result.success) {
    badRequest(
      reply,
      result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    );
    return null;
  }
  return result.data;
}

export function requireCompanyId(
  request: FastifyRequest,
  reply: FastifyReply,
): string | null {
  const companyId = request.sessionUser.companyId;
  if (!companyId) {
    badRequest(reply, "No company associated with this account");
    return null;
  }
  return companyId;
}

// ── Profile ──────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  language: z.enum(["uk", "en"]),
});

export const carrierOnboardSchema = z.object({
  companyName: z.string().min(2),
  taxId: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
});

export const freelanceOnboardSchema = z.object({
  phone: z.string().optional(),
  licenseNumber: z.string().min(1),
  vehicleType: z.enum(["Truck", "Van", "Refrigerated"]),
  payloadT: z.number().positive(),
});

export const onboardSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("CARRIER_ADMIN") }).merge(carrierOnboardSchema),
  z
    .object({ role: z.literal("FREELANCE_DRIVER") })
    .merge(freelanceOnboardSchema),
]);

// ── Company ──────────────────────────────────────────────────────────

export const companyUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  taxId: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  logoUrl: z.string().url().optional(),
});

// ── Fleet ────────────────────────────────────────────────────────────

export const truckCreateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["Truck", "Semi", "Refrigerated", "Flatbed"]),
  payloadT: z.number().positive(),
  trailerId: z.string().optional(),
  trackerId: z.string().min(1),
  locationLabel: z.string().min(1),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

export const truckUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["Truck", "Semi", "Refrigerated", "Flatbed"]).optional(),
  payloadT: z.number().positive().optional(),
  trailerId: z.string().nullable().optional(),
  trackerId: z.string().min(1).optional(),
  status: z.enum(["idle", "on_road", "maintenance"]).optional(),
  locationLabel: z.string().min(1).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  assignedDriverId: z.string().nullable().optional(),
});

// ── Tasks ────────────────────────────────────────────────────────────

export const taskCreateSchema = z.object({
  title: z.string().min(1),
  cargoDescription: z.string().min(1),
  cargoType: z.enum(["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"]),
  weightT: z.number().positive(),
  originLabel: z.string().min(1),
  originLat: z.number().optional().default(0),
  originLng: z.number().optional().default(0),
  destinationLabel: z.string().min(1),
  destinationLat: z.number().optional().default(0),
  destinationLng: z.number().optional().default(0),
  distanceKm: z.number().optional().default(0),
  deadline: z.string().datetime({ offset: true }).or(z.string().min(1)),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"]),
  assignedTruckId: z.string().nullable().optional(),
  notes: z.string().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const taskStatusSchema = z.object({
  status: z.enum(["Pending", "Assigned", "InTransit", "Delivered", "Completed"]),
});

// ── Routes ───────────────────────────────────────────────────────────

export const routeGenerateSchema = z.object({
  taskIds: z.array(z.string()).min(1),
  truckIds: z.array(z.string()).min(1),
});

export const routeStatusSchema = z.object({
  status: z.enum(["active", "completed"]),
});

// ── Team ─────────────────────────────────────────────────────────────

export const inviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum([
    "CARRIER_MANAGER",
    "CARRIER_DRIVER",
    "CARRIER_WAREHOUSE_MANAGER",
  ]),
});

// ── Messages ─────────────────────────────────────────────────────────

export const threadCreateSchema = z.object({
  type: z.enum(["task", "direct", "group"]),
  title: z.string().min(1),
  participantIds: z.array(z.string()).optional(),
  taskId: z.string().optional(),
});

export const messageCreateSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1),
});

// ── Demand ───────────────────────────────────────────────────────────

export const demandCreateSchema = z.object({
  taskId: z.string().optional(),
  requiredTruckType: z.enum(["Truck", "Semi", "Refrigerated", "Flatbed"]),
  cargoType: z.enum(["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"]),
  payloadT: z.number().positive(),
  originLabel: z.string().min(1),
  originLat: z.number().optional().default(0),
  originLng: z.number().optional().default(0),
  destinationLabel: z.string().min(1),
  destinationLat: z.number().optional().default(0),
  destinationLng: z.number().optional().default(0),
  distanceKm: z.number().optional().default(0),
  deadline: z.string().min(1),
  budgetUah: z.number().positive(),
});

// ── Offers ───────────────────────────────────────────────────────────

export const offerCreateSchema = z.object({
  demandRequestId: z.string().min(1),
  offeredPriceUah: z.number().positive(),
  estimatedHours: z.number().positive().optional(),
  note: z.string().optional(),
});

export const offerCounterSchema = z.object({
  offeredPriceUah: z.number().positive(),
  note: z.string().optional(),
});
