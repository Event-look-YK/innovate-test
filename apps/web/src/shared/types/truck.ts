export type TruckType = "Truck" | "Semi" | "Refrigerated" | "Flatbed";

export type TruckStatus = "idle" | "on_road" | "maintenance";

export type Truck = {
  id: string;
  companyId?: string;
  name: string;
  type: TruckType;
  payloadT: number;
  trailerId: string | null;
  trackerId: string;
  status: TruckStatus;
  locationLabel: string;
  locationLat?: number;
  locationLng?: number;
  assignedDriverId?: string | null;
  createdAt?: string;
};
