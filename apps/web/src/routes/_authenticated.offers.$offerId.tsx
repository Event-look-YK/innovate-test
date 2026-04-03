import { createFileRoute } from "@tanstack/react-router";

import { OfferDetailView } from "@/views/offers/offer-detail-view";

export const Route = createFileRoute("/_authenticated/offers/$offerId")({
  component: OfferDetailView,
});
