import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { formatCurrencyUah } from "@/shared/lib/format";
import type { FreightOffer } from "@/shared/types/offer";

type Props = {
  offer: FreightOffer;
};

export const OfferSummaryCard = ({ offer: o }: Props) => (
  <Card>
    <CardHeader className="pb-2">
      <h2 className="text-lg font-semibold">{o.taskTitle}</h2>
      <p className="text-sm text-muted-foreground">
        {o.originLabel} → {o.destinationLabel} · {o.distanceKm} km · {o.cargoType}
      </p>
    </CardHeader>
    <CardContent className="flex flex-col gap-1 text-sm">
      <p>
        Weight: {o.weightT} t · Deadline: {o.deadline}
      </p>
      <p className="font-medium">Offered: {formatCurrencyUah(o.offeredPriceUah)}</p>
    </CardContent>
    <CardFooter className="flex flex-wrap gap-2">
      <Link className={cn(buttonVariants({ size: "sm" }))} params={{ offerId: o.id }} to="/offers/$offerId">
        Open
      </Link>
    </CardFooter>
  </Card>
);
