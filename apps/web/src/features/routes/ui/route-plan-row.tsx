import { cn } from "@innovate-test/ui/lib/utils";

import { routeStatusPresentation } from "@/features/routes/lib/utils";
import { ListRowLink } from "@/shared/ui/list-row-link";
import type { RoutePlanListItem } from "@/shared/types/route";

type Props = {
  route: RoutePlanListItem;
};

export const RoutePlanRow = ({ route: r }: Props) => (
  <ListRowLink
    badges={
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1",
          routeStatusPresentation[r.status] ?? "bg-muted text-muted-foreground ring-border",
        )}
      >
        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
      </span>
    }
    footer={
      <>
        <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {r.id}
        </span>
        <span className="tabular-nums">{r.distanceKm} km</span>
        <span>{r.durationHours.toFixed(1)} h</span>
      </>
    }
    leading={
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
        {(r.loadT / Math.max(r.capacityT, 1) * 100).toFixed(0)}%
      </div>
    }
    routeParams={{ routeId: r.id }}
    subtitle={`${r.loadT} / ${r.capacityT} t`}
    title={r.truckName ?? "Unknown truck"}
    to="/routes/$routeId"
  />
);
