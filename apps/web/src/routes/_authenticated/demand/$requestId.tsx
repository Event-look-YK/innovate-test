import { createFileRoute } from "@tanstack/react-router";

import { DemandDetailView } from "@/views/demand/demand-detail-view";

export const Route = createFileRoute("/_authenticated/demand/$requestId")({
  component: DemandDetailView,
});
