import { useState } from "react";

import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { Input } from "@innovate-test/ui/components/input";

import {
  useAcceptFreightOffer,
  useCounterFreightOffer,
  useDeclineFreightOffer,
  useDemandOffers,
} from "@/features/offers/hooks/use-offers";
import { formatCurrencyUah } from "@/shared/lib/format";
import type { FreightOfferListItem } from "@/shared/types/offer";

type Props = {
  requestId: string;
};

const OfferActions = ({ offer }: { offer: FreightOfferListItem }) => {
  const [showCounter, setShowCounter] = useState(false);
  const [counterPrice, setCounterPrice] = useState("");
  const [counterNote, setCounterNote] = useState("");

  const acceptMutation = useAcceptFreightOffer();
  const declineMutation = useDeclineFreightOffer();
  const counterMutation = useCounterFreightOffer();

  if (offer.status !== "open") {
    return (
      <span className="text-sm font-medium capitalize text-muted-foreground">
        {offer.status}
      </span>
    );
  }

  const handleCounterSubmit = () => {
    const price = Number(counterPrice);
    if (!price || price <= 0) return;
    counterMutation.mutate(
      { offerId: offer.id, offeredPriceUah: price, note: counterNote || undefined },
      {
        onSuccess: () => {
          setShowCounter(false);
          setCounterPrice("");
          setCounterNote("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          disabled={acceptMutation.isPending}
          onClick={() => acceptMutation.mutate(offer.id)}
        >
          {acceptMutation.isPending ? "Accepting..." : "Accept"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={declineMutation.isPending}
          onClick={() => declineMutation.mutate(offer.id)}
        >
          {declineMutation.isPending ? "Declining..." : "Decline"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCounter((v) => !v)}
        >
          Counter
        </Button>
      </div>
      {showCounter && (
        <div className="flex flex-col gap-2 rounded-md border border-border p-2">
          <Input
            type="number"
            placeholder="Counter price (UAH)"
            value={counterPrice}
            onChange={(e) => setCounterPrice(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Note (optional)"
            value={counterNote}
            onChange={(e) => setCounterNote(e.target.value)}
          />
          <Button
            size="sm"
            disabled={counterMutation.isPending || !counterPrice}
            onClick={handleCounterSubmit}
          >
            {counterMutation.isPending ? "Sending..." : "Send counter-offer"}
          </Button>
        </div>
      )}
    </div>
  );
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
              className="flex flex-col gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{o.taskTitle ?? "Freight offer"}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.originLabel} → {o.destinationLabel}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-semibold">{formatCurrencyUah(o.offeredPriceUah)}</p>
                </div>
              </div>
              <OfferActions offer={o} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
