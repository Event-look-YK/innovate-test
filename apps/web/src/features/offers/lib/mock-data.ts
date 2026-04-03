import type { FreightOffer } from "@/shared/types/offer";

export const mockOffers: FreightOffer[] = [
  {
    id: "o1",
    taskTitle: "Frozen fish transport",
    originLabel: "Odesa",
    destinationLabel: "Lviv",
    distanceKm: 680,
    cargoType: "Refrigerated",
    weightT: 12,
    deadline: "Apr 8",
    offeredPriceUah: 18_500,
    status: "open",
  },
  {
    id: "o2",
    taskTitle: "Electronics shipment",
    originLabel: "Kyiv",
    destinationLabel: "Zhytomyr",
    distanceKm: 140,
    cargoType: "Fragile",
    weightT: 5,
    deadline: "Apr 12",
    offeredPriceUah: 9_200,
    status: "open",
  },
];
