import { cn } from "@innovate-test/ui/lib/utils";

import { getTruckTypePresentation, truckStatusPresentation } from "@/features/fleet/lib/utils";
import { ListRowLink } from "@/shared/ui/list-row-link";
import type { Truck } from "@/shared/types/truck";

type Props = {
  truck: Truck;
};

export const FleetTruckRow = ({ truck: t }: Props) => {
  const tc = getTruckTypePresentation(t.type);
  const sc = truckStatusPresentation[t.status];
  return (
    <ListRowLink
      badges={
        <span className="inline-flex h-4 items-center gap-1.5 rounded-full bg-muted/70 px-2 text-[10px] font-semibold text-foreground/85 ring-1 ring-border/50">
          <span className={cn("size-1.5 shrink-0 rounded-full", sc?.dot)} />
          {sc?.label ?? t.status}
        </span>
      }
      footer={
        <>
          <span>{t.type}</span>
          <span className="tabular-nums">{t.payloadT} t payload</span>
          <span className="min-w-0 truncate">{t.locationLabel}</span>
        </>
      }
      routeParams={{ truckId: t.id }}
      subtitle={`Tracker ${t.trackerId}`}
      title={t.name}
      to="/fleet/$truckId"
    />
  );
};
