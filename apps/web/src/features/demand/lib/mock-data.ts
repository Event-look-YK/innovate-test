export type DemandRequest = {
  id: string;
  taskTitle: string;
  truckType: string;
  payloadT: number;
  routeLabel: string;
  budgetUah: number;
  status: "Open" | "Offers sent" | "Accepted" | "In progress" | "Completed";
};

export const mockDemand: DemandRequest[] = [
  {
    id: "d1",
    taskTitle: "Oversized machinery",
    truckType: "Flatbed",
    payloadT: 22,
    routeLabel: "Lviv → Uman",
    budgetUah: 45_000,
    status: "Open",
  },
  {
    id: "d2",
    taskTitle: "Cold chain pharma",
    truckType: "Refrigerated",
    payloadT: 8,
    routeLabel: "Kyiv → Odesa",
    budgetUah: 38_000,
    status: "Offers sent",
  },
];
