import type { RoutePlan } from "@/shared/types/route";

export const mockRoutes: RoutePlan[] = [
  {
    id: "r1",
    truckName: "MAN TGX #01",
    stops: [
      { id: "s1", label: "Uman", eta: "09:00", note: "Pickup Steel coils" },
      { id: "s2", label: "Kyiv", eta: "12:30", note: "Deliver / pickup electronics" },
      { id: "s3", label: "Zhytomyr", eta: "15:30", note: "Deliver electronics" },
    ],
    distanceKm: 420,
    durationHours: 6,
    loadT: 18,
    capacityT: 24,
    status: "active",
    createdAt: "2026-04-02",
  },
];
