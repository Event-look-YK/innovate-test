export type RouteStop = {
  id: string;
  label: string;
  eta: string;
  note: string;
};

export type RoutePlan = {
  id: string;
  truckName: string;
  stops: RouteStop[];
  distanceKm: number;
  durationHours: number;
  loadT: number;
  capacityT: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
};
