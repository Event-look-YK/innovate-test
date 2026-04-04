import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";
import { ArrowRightIcon, MapPinIcon, WeightIcon } from "lucide-react";

import { formatCurrencyUah } from "@/shared/lib/format";
import type { FreightOffer } from "@/shared/types/offer";

type Props = {
  offer: FreightOffer;
};

export const OfferSummaryCard = ({ offer: o }: Props) => (
  <Card className="group border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20 overflow-hidden">
    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, oklch(0.540 0.200 267 / 0.6), oklch(0.580 0.200 300 / 0.4))" }} />
    <CardHeader className="pb-2 pt-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-tight">{o.taskTitle}</h2>
        <span className="shrink-0 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">
          {o.cargoType}
        </span>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-2.5 pb-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPinIcon className="size-3.5 shrink-0" />
        <span className="truncate">{o.originLabel} → {o.destinationLabel}</span>
        <span className="shrink-0 text-muted-foreground/60">· {o.distanceKm} km</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <WeightIcon className="size-3.5" />
          {o.weightT} t
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground">Due {o.deadline}</span>
      </div>
      <div className="rounded-xl bg-emerald-50 px-3 py-2">
        <p className="text-xs text-muted-foreground">Offered price</p>
        <p className="text-lg font-black text-emerald-700">{formatCurrencyUah(o.offeredPriceUah)}</p>
      </div>
    </CardContent>
    <CardFooter className="border-t border-border/40 pt-3 pb-4">
      <Link
        className={cn(buttonVariants({ size: "sm" }), "w-full gap-2")}
        params={{ offerId: o.id }}
        to="/offers/$offerId"
      >
        View offer
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </CardFooter>
  </Card>
);
