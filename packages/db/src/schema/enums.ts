import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "CARRIER_ADMIN",
  "CARRIER_MANAGER",
  "CARRIER_DRIVER",
  "CARRIER_WAREHOUSE_MANAGER",
  "FREELANCE_DRIVER",
]);

export const truckTypeEnum = pgEnum("truck_type", [
  "Truck",
  "Semi",
  "Refrigerated",
  "Flatbed",
]);

export const truckStatusEnum = pgEnum("truck_status", [
  "idle",
  "on_road",
  "maintenance",
]);

export const cargoTypeEnum = pgEnum("cargo_type", [
  "General",
  "Refrigerated",
  "Hazardous",
  "Oversized",
  "Fragile",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "EMERGENCY",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "Pending",
  "Assigned",
  "InTransit",
  "Delivered",
  "Completed",
]);

export const routeStatusEnum = pgEnum("route_status", [
  "draft",
  "active",
  "completed",
]);

export const offerStatusEnum = pgEnum("offer_status", [
  "open",
  "accepted",
  "declined",
]);

export const demandStatusEnum = pgEnum("demand_status", [
  "Open",
  "Offers sent",
  "Accepted",
  "In progress",
  "Completed",
]);

export const messageStatusEnum = pgEnum("message_status", [
  "sent",
  "delivered",
  "read",
  "queued",
]);

export const threadTypeEnum = pgEnum("thread_type", [
  "task",
  "direct",
  "group",
]);

export const freelanceVehicleTypeEnum = pgEnum("freelance_vehicle_type", [
  "Truck",
  "Van",
  "Refrigerated",
]);

export const routeOfferStatusEnum = pgEnum("route_offer_status", [
  "open",
  "accepted",
  "cancelled",
]);

export const routeOfferTriggerEnum = pgEnum("route_offer_trigger", [
  "manual",
  "auto",
]);
