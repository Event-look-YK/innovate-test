export type MarketplaceOffer = {
  offerId: string;
  routePlanId: string;
  companyId: string;
  companyName: string;
  triggerType: "manual" | "auto";
  createdAt: string;
  distanceKm: number;
  durationHours: number;
  loadT: number;
  capacityT: number;
};

export type MarketplaceOfferStop = {
  id: string;
  routePlanId: string;
  label: string;
  lat: number;
  lng: number;
  eta: string;
  note: string | null;
  sortOrder: number;
};

export type MarketplaceOfferTask = {
  id: string;
  title: string;
  cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  weightT: number;
  originLabel: string;
  destinationLabel: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  deadline: string;
};

export type MarketplaceOfferDetail = MarketplaceOffer & {
  status: "open" | "accepted" | "cancelled";
  stops: MarketplaceOfferStop[];
  tasks: MarketplaceOfferTask[];
};

export type AcceptOfferResponse = {
  offerId: string;
  routePlanId: string;
  status: "accepted";
};

export type RouteOfferStatus = {
  id: string;
  routePlanId: string;
  status: "open" | "accepted" | "cancelled";
  triggerType: "manual" | "auto";
  acceptedByDriverId: string | null;
  acceptedAt: string | null;
  createdAt: string;
  driverName: string | null;
  driverEmail: string | null;
};

export type CreateRouteOfferResponse = {
  offerId: string;
  routePlanId: string;
  status: "open";
};

export type FreightOfferStatus = "open" | "accepted" | "declined";

export type FreightOfferListItem = {
  id: string;
  demandRequestId: string;
  freelancerUserId?: string;
  taskTitle: string | null;
  originLabel: string;
  destinationLabel: string;
  distanceKm: number;
  cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  weightT: number;
  deadline: string;
  offeredPriceUah: number;
  estimatedHours?: number | null;
  note?: string | null;
  status: FreightOfferStatus;
  createdAt: string;
};
