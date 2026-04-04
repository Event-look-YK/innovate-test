import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { useAcceptOffer } from "@/features/offers/hooks/use-offers";
import { RouteMap } from "@/shared/ui/route-map";
import type { MarketplaceOfferDetail } from "@/shared/types/offer";

type Props = {
  offer: MarketplaceOfferDetail;
};

export const OfferDetailRespondCard = ({ offer }: Props) => {
  const accept = useAcceptOffer();
  const locations = [...offer.stops]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.label);

  return (
    <>
      <RouteMap locations={locations} className="min-h-[240px] rounded-lg" />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Respond</CardTitle>
        </CardHeader>
        <CardContent>
          {offer.status === "open" ? (
            <Button
              className="w-full"
              disabled={accept.isPending}
              type="button"
              onClick={() => accept.mutate(offer.offerId)}
            >
              {accept.isPending ? "Приймаємо..." : "Прийняти маршрут"}
            </Button>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">Вже зайнятий</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
