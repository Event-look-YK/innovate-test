import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { useDemandOffers } from "@/features/offers/hooks/use-offers";
import { formatCurrencyUah } from "@/shared/lib/format";

type Props = {
  requestId: string;
};

export const DemandFreelancersCard = ({ requestId }: Props) => {
  const { data: offers, isPending } = useDemandOffers(requestId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Received offers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Loading offers...</p>
        ) : !offers?.length ? (
          <p className="text-sm text-muted-foreground">No offers yet.</p>
        ) : (
          offers.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{o.taskTitle ?? "Freight offer"}</p>
                <p className="text-sm text-muted-foreground">
                  {o.originLabel} → {o.destinationLabel}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{formatCurrencyUah(o.offeredPriceUah)}</p>
                <p className="text-muted-foreground">{o.status}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
