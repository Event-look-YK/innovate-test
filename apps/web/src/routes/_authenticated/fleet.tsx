import { createFileRoute } from "@tanstack/react-router";

import { FleetView } from "@/views/fleet/fleet-view";

export const Route = createFileRoute("/_authenticated/fleet")({
  component: FleetView,
});
