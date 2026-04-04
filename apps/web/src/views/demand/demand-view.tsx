import { cn } from "@innovate-test/ui/lib/utils";
import { ZapIcon } from "lucide-react";

import { useDemand } from "@/features/demand/hooks/use-demand";
import { formatCurrencyUah } from "@/shared/lib/format";
import { ListRowLink } from "@/shared/ui/list-row-link";

const demandStatusStyles: Record<string, string> = {
  Open: "bg-sky-50 text-sky-700 ring-sky-200",
  "Offers sent": "bg-violet-50 text-violet-700 ring-violet-200",
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "In progress": "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-slate-50 text-slate-600 ring-slate-200",
};

const truckTypeDotColor: Record<string, string> = {
  Truck: "bg-blue-400",
  Semi: "bg-amber-400",
  Refrigerated: "bg-cyan-400",
  Flatbed: "bg-orange-400",
  Tanker: "bg-purple-400",
};

export const DemandView = () => {
  const { data: rows, isPending } = useDemand();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Demand</h1>
        <p className="text-sm text-muted-foreground">Freelance capacity gaps</p>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          Loading demand…
        </div>
      ) : rows?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
          <ZapIcon className="mb-3 size-10 text-muted-foreground/45" />
          <p className="font-medium text-foreground">No open requests</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            When you need extra capacity, new demand will show up here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows?.map((r) => (
            <ListRowLink
              key={r.id}
              badges={
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1",
                    demandStatusStyles[r.status] ?? "bg-muted text-muted-foreground ring-border",
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
                        truckTypeDotColor[r.truckType] ?? "bg-muted-foreground",
                      )}
                    />
                    {r.truckType}
                  </span>
                  <span className="tabular-nums">{r.payloadT} t</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatCurrencyUah(r.budgetUah)}
                  </span>
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
          ))}
        </div>
      )}
    </div>
  );
};
