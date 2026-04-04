import { useState } from "react";
import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { Button } from "@innovate-test/ui/components/button";
import { StoreIcon } from "lucide-react";

import { OfferSummaryCard } from "@/features/offers/ui/offer-summary-card";
import { useMarketplaceOffers } from "@/features/offers/hooks/use-offers";
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
      <StoreIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">No open routes</p>
      <p className="mt-0.5 text-sm text-muted-foreground">New route offers will appear here when companies post them.</p>
    </div>
  </div>
);

export const OffersView = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useMarketplaceOffers(page);
  const offers = data?.data;
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Маркетплейс" description="Відкриті маршрути для фрілансерів" />
      {isPending ? (
        <OffersLoadingGrid />
      ) : !offers?.length ? (
        <OffersEmpty />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((o) => (
              <OfferSummaryCard key={o.offerId} offer={o} />
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                disabled={page <= 1}
                size="sm"
                type="button"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {meta.page} / {meta.totalPages}
              </span>
              <Button
                disabled={page >= meta.totalPages}
                size="sm"
                type="button"
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
