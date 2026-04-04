import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useOffers } from "@/features/offers/hooks/use-offers";
import { OfferDetailCargoCard, OfferDetailCarrierCard } from "@/features/offers/ui/offer-detail-summary";
import { OfferDetailRespondCard } from "@/features/offers/ui/offer-detail-respond-card";

export const OfferDetailView = () => {
  const { offerId } = useParams({ strict: false }) as { offerId: string };
  const { data: offers } = useOffers();
  const offer = offers?.find((o) => o.id === offerId);

  if (!offer) {
    return <p className="text-muted-foreground">Offer not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/offers">
        ← Offers
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{offer.taskTitle}</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <OfferDetailCargoCard offer={offer} />
        <OfferDetailCarrierCard />
      </div>
      <OfferDetailRespondCard offer={offer} />
    </div>
  );
};
