import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";
import { ArrowRightIcon, RouteIcon, WeightIcon } from "lucide-react";

import { formatDuration, formatRelativeTime } from "@/shared/lib/format";
import type { MarketplaceOffer } from "@/shared/types/offer";

type Props = {
  offer: MarketplaceOffer;
};

export const OfferSummaryCard = ({ offer: o }: Props) => (
  <Card className="group overflow-hidden border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
    <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, oklch(0.540 0.200 267 / 0.6), oklch(0.580 0.200 300 / 0.4))" }} />
    <CardHeader className="pb-2 pt-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-tight">{o.companyName}</h2>
        <span className="shrink-0 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">
          {o.triggerType === "auto" ? "Auto" : "Manual"}
        </span>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-2.5 pb-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <RouteIcon className="size-3.5 shrink-0" />
        <span>{o.distanceKm} km · {formatDuration(o.durationHours)}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <WeightIcon className="size-3.5" />
          {o.loadT} / {o.capacityT} t
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground">{formatRelativeTime(o.createdAt)}</span>
      </div>
    </CardContent>
    <CardFooter className="border-t border-border/40 pb-4 pt-3">
      <Link
        className={cn(buttonVariants({ size: "sm" }), "w-full gap-2")}
        params={{ offerId: o.offerId }}
        to="/offers/$offerId"
      >
        View offer
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </CardFooter>
  </Card>
);
