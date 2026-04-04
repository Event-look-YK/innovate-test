import { createFileRoute } from "@tanstack/react-router";

import { RouteDetailView } from "@/views/routes/route-detail-view";

export const Route = createFileRoute("/_authenticated/routes_/$routeId")({
  component: RouteDetailView,
});
