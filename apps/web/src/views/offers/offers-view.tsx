import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { TagIcon } from "lucide-react";

import { OfferSummaryCard } from "@/features/offers/ui/offer-summary-card";
import { useOffers } from "@/features/offers/hooks/use-offers";
import { PageHeader } from "@/shared/ui/page-header";

const OffersLoadingGrid = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const OffersEmpty = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/8">
      <TagIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">No offers yet</p>
      <p className="mt-0.5 text-sm text-muted-foreground">New freight offers will appear here when they match your vehicle.</p>
    </div>
  </div>
);

export const OffersView = () => {
  const { data: offers, isPending } = useOffers();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Offers" description="Inbound freight opportunities" />
      {isPending ? (
        <OffersLoadingGrid />
      ) : !offers?.length ? (
        <OffersEmpty />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => (
            <OfferSummaryCard key={o.id} offer={o} />
          ))}
        </div>
      )}
    </div>
  );
};
