import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatCurrencyUah } from "@/shared/lib/format";
import type { FreightOffer } from "@/shared/types/offer";

type Props = {
  offer: FreightOffer;
};

export const OfferDetailCargoCard = ({ offer }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Cargo</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      <p>
        {offer.cargoType} · {offer.weightT} t
      </p>
      <p>
        {offer.originLabel} → {offer.destinationLabel} ({offer.distanceKm} km)
      </p>
      <p>Deadline {offer.deadline}</p>
      <p className="mt-2 font-medium text-foreground">Offered {formatCurrencyUah(offer.offeredPriceUah)}</p>
    </CardContent>
  </Card>
);

export const OfferDetailCarrierCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Carrier</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">Mock carrier · ★ 4.9</CardContent>
  </Card>
);
