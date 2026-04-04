import { OfferSummaryCard } from "@/features/offers/ui/offer-summary-card";
import { useOffers } from "@/features/offers/hooks/use-offers";

export const OffersView = () => {
  const { data: offers, isPending } = useOffers();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Offers</h1>
        <p className="text-muted-foreground">Inbound freight</p>
      </div>
      {isPending ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers?.map((o) => (
            <OfferSummaryCard key={o.id} offer={o} />
          ))}
        </div>
      )}
    </div>
  );
};
