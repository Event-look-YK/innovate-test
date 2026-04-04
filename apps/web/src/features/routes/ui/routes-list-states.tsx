import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { cn } from "@innovate-test/ui/lib/utils";
import { RouteIcon } from "lucide-react";

export const RoutesListLoading = () => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export const RoutesListEmpty = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/8">
      <RouteIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">No routes yet</p>
      <p className="mt-0.5 max-w-sm text-sm text-muted-foreground">
        Create a plan to assign stops and distances to your trucks.
      </p>
    </div>
    <Link className={cn(buttonVariants(), "mt-2")} to="/routes/generate">
      Generate route
    </Link>
  </div>
);
