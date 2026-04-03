export type FreightOffer = {
  id: string;
  taskTitle: string;
  originLabel: string;
  destinationLabel: string;
  distanceKm: number;
  cargoType: string;
  weightT: number;
  deadline: string;
  offeredPriceUah: number;
  status: "open" | "accepted" | "declined";
};
