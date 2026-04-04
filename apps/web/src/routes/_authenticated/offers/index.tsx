import { createFileRoute } from "@tanstack/react-router";

import { OffersView } from "@/views/offers/offers-view";

export const Route = createFileRoute("/_authenticated/offers/")({
  component: OffersView,
});
