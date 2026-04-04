import type { PaginatedResponse } from "./pagination";

export type DemandStatus =
  | "Open"
  | "Offers sent"
  | "Accepted"
  | "In progress"
  | "Completed";

export type DemandRequestListItem = {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  requiredTruckType: "Truck" | "Semi" | "Refrigerated" | "Flatbed";
  cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  payloadT: number;
  originLabel: string;
  destinationLabel: string;
  distanceKm: number;
  budgetUah: number;
  deadline: string;
  status: DemandStatus;
  createdAt: string;
};

export type DemandRequestDetail = DemandRequestListItem & {
  companyId: string;
  offerCount: number;
};

export type DemandRequestsResponse = PaginatedResponse<DemandRequestListItem>;
