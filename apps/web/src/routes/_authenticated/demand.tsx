import { createFileRoute } from "@tanstack/react-router";

import { DemandView } from "@/views/demand/demand-view";

export const Route = createFileRoute("/_authenticated/demand")({
  component: DemandView,
});
