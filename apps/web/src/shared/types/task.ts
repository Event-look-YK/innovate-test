import type { CargoType, TaskPriority, TaskStatus } from "@/shared/constants/task-status";

export type Task = {
  id: string;
  title: string;
  cargoDescription: string;
  cargoType: CargoType;
  weightT: number;
  originLabel: string;
  destinationLabel: string;
  distanceKm: number;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTruckId: string | null;
};
