import type { PaginatedResponse } from "./pagination";

export type RouteStop = {
  id: string;
  routePlanId: string;
  label: string;
  lat: number;
  lng: number;
  eta: string;
  note: string | null;
  sortOrder: number;
};

export type RouteTask = {
  id: string;
  title: string;
  cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  weightT: number;
  originLabel: string;
  destinationLabel: string;
  status: "Pending" | "Assigned" | "InTransit" | "Delivered" | "Completed";
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
};

export type RoutePlanListItem = {
  id: string;
  truckId: string;
  truckName: string | null;
  distanceKm: number;
  durationHours: number;
  loadT: number;
  capacityT: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
};

export type RoutePlan = RoutePlanListItem & {
  driverId: string | null;
  stops: RouteStop[];
  tasks: RouteTask[];
};

export type RoutesResponse = PaginatedResponse<RoutePlanListItem>;

export type PlanStats = {
  total_distance_km: number;
  total_cost_uah: number;
  total_empty_km: number;
  trucks_used: number;
  trucks_idle: number;
  avg_utilization_pct: number;
};

export type UnassignedTask = {
  task_id: string;
  reason: string;
};

export type GenerateRoutesRequest = {
  taskIds: string[];
  truckIds: string[];
};

export type GenerateRoutesResponse = {
  plan: PlanStats;
  routes: Array<{
    id: string;
    truckName: string;
    stops: Array<{ id: string; label: string; eta: string; note: string | null; sortOrder: number }>;
    distanceKm: number;
    durationHours: number;
    loadT: number;
    capacityT: number;
    status: "draft";
    createdAt: string;
  }>;
  unassigned: UnassignedTask[];
  warnings: string[];
};
