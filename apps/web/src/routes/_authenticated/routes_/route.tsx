import { createFileRoute } from "@tanstack/react-router";

import { RoutesView } from "@/views/routes/routes-view";

export const Route = createFileRoute("/_authenticated/routes_")({
  component: RoutesView,
});
