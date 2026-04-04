import { cn } from "@innovate-test/ui/lib/utils";

import {
  demandStatusPresentation,
  demandTruckTypeDot,
} from "@/features/demand/lib/utils";
import { formatCurrencyUah } from "@/shared/lib/format";
import { ListRowLink } from "@/shared/ui/list-row-link";
import type { DemandRequest } from "@/features/demand/lib/mock-data";

type Props = {
  row: DemandRequest;
};

export const DemandRequestRow = ({ row: r }: Props) => (
  <ListRowLink
    badges={
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1",
          demandStatusPresentation[r.status] ?? "bg-muted text-muted-foreground ring-border",
        )}
      >
        {r.status}
      </span>
    }
    footer={
      <>
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              demandTruckTypeDot[r.truckType] ?? "bg-muted-foreground",
            )}
          />
          {r.truckType}
        </span>
        <span className="tabular-nums">{r.payloadT} t</span>
        <span className="font-semibold tabular-nums text-foreground">{formatCurrencyUah(r.budgetUah)}</span>
      </>
    }
    leading={
      <div className="flex size-11 flex-col items-center justify-center rounded-xl bg-muted/70 font-mono text-[10px] font-bold leading-tight text-muted-foreground">
        {r.id}
      </div>
    }
    routeParams={{ requestId: r.id }}
    subtitle={
      <span className="line-clamp-2">
        <span className="text-foreground/85">{r.routeLabel.split("→")[0]?.trim()}</span>
        <span className="mx-1 text-muted-foreground/60">→</span>
        <span className="text-foreground/85">{r.routeLabel.split("→")[1]?.trim()}</span>
      </span>
    }
    title={r.taskTitle}
    to="/demand/$requestId"
  />
);
