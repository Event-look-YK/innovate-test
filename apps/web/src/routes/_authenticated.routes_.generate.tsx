import { createFileRoute } from "@tanstack/react-router";

import { RouteGenerateView } from "@/views/routes/route-generate-view";

export const Route = createFileRoute("/_authenticated/routes_/generate")({
  component: RouteGenerateView,
});
