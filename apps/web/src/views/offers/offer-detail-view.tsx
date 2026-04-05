import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { cn } from "@innovate-test/ui/lib/utils";

import { useMarketplaceOfferDetail } from "@/features/offers/hooks/use-offers";
import {
  OfferDetailRouteCard,
  OfferDetailStopsTimeline,
  OfferDetailTasksList,
} from "@/features/offers/ui/offer-detail-summary";
import { OfferDetailRespondCard } from "@/features/offers/ui/offer-detail-respond-card";

export const OfferDetailView = () => {
  const { offerId } = useParams({ strict: false }) as { offerId: string };
  const { data: offer, isPending, isError } = useMarketplaceOfferDetail(offerId);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !offer) {
    return <p className="text-muted-foreground">Offer not found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/offers">
        ← Маркетплейс
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{offer.companyName}</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <OfferDetailRouteCard offer={offer} />
        <OfferDetailStopsTimeline stops={offer.stops} />
      </div>
      <OfferDetailTasksList tasks={offer.tasks} />
      <OfferDetailRespondCard offer={offer} />
    </div>
  );
};
