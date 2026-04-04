import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { RouteIcon } from "lucide-react";

export const RoutesListLoading = () => (
  <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
    Loading routes…
  </div>
);

export const RoutesListEmpty = () => (
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
);
