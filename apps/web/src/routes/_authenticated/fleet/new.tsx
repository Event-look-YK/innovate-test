import { createFileRoute } from "@tanstack/react-router";

import { TruckCreateView } from "@/views/fleet/truck-create-view";

export const Route = createFileRoute("/_authenticated/fleet/new")({
  component: TruckCreateView,
});
