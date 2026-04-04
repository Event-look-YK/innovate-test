import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { RouteIcon } from "lucide-react";

import { useRoutes } from "@/features/routes/hooks/use-routes";
import { ListRowLink } from "@/shared/ui/list-row-link";

const routeStatusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  planned: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-slate-50 text-slate-600 ring-slate-200",
  cancelled: "bg-red-50 text-red-600 ring-red-200",
};

export const RoutesView = () => {
  const { data: routes, isPending } = useRoutes();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Routes</h1>
          <p className="text-sm text-muted-foreground">Generated delivery plans</p>
        </div>
        <Link className={cn(buttonVariants(), "w-full shrink-0 sm:w-auto")} to="/routes/generate">
          Generate route
        </Link>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          Loading routes…
        </div>
      ) : routes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
          <RouteIcon className="mb-3 size-10 text-muted-foreground/45" />
          <p className="font-medium text-foreground">No routes yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a plan to assign stops and distances to your trucks.
          </p>
          <Link className={cn(buttonVariants(), "mt-5")} to="/routes/generate">
            Generate route
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {routes?.map((r) => (
            <ListRowLink
              key={r.id}
              badges={
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ring-1",
                    routeStatusStyles[r.status] ?? "bg-muted text-muted-foreground ring-border",
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
                  <span>
                    {r.stops.length} stop{r.stops.length === 1 ? "" : "s"}
                  </span>
                </>
              }
              leading={
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {r.stops.length}
                </div>
              }
              routeParams={{ routeId: r.id }}
              subtitle={
                r.stops.length > 0
                  ? `${r.stops[0]?.label} → ${r.stops[r.stops.length - 1]?.label}`
                  : "No stops"
              }
              title={r.truckName}
              to="/routes/$routeId"
            />
          ))}
        </div>
      )}
    </div>
  );
};
