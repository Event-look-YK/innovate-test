import { createFileRoute } from "@tanstack/react-router";

import { TruckDetailView } from "@/views/fleet/truck-detail-view";

export const Route = createFileRoute("/_authenticated/fleet/$truckId")({
  component: TruckDetailView,
});
