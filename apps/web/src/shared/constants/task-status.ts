export const TASK_STATUSES = [
  "Pending",
  "Assigned",
  "InTransit",
  "Delivered",
  "Completed",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const CARGO_TYPES = ["General", "Refrigerated", "Hazardous", "Oversized", "Fragile"] as const;

export type CargoType = (typeof CARGO_TYPES)[number];
