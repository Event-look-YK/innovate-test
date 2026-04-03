export type TruckType = "Truck" | "Semi" | "Refrigerated" | "Flatbed";

export type TruckStatus = "idle" | "on_road" | "maintenance";

export type Truck = {
  id: string;
  name: string;
  type: TruckType;
  payloadT: number;
  trailerId: string | null;
  trackerId: string;
  status: TruckStatus;
  locationLabel: string;
};
