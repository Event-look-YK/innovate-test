import type { CargoType, TaskPriority, TaskStatus } from "@/shared/constants/task-status";

export type Task = {
  id: string;
  companyId?: string;
  title: string;
  cargoDescription: string;
  cargoType: CargoType;
  weightT: number;
  originLabel: string;
  originLat?: number;
  originLng?: number;
  destinationLabel: string;
  destinationLat?: number;
  destinationLng?: number;
  distanceKm: number;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTruckId: string | null;
  notes?: string | null;
  createdAt?: string;
};
