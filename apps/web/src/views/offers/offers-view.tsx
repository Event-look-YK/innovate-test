import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { useOffers } from "@/features/offers/hooks/use-offers";
import { formatCurrencyUah } from "@/shared/lib/format";

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
            <Card key={o.id}>
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
                <Link
                  className={cn(buttonVariants({ size: "sm" }))}
                  params={{ offerId: o.id }}
                  to="/offers/$offerId"
                >
                  Open
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
