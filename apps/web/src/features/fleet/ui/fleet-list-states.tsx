import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { TruckIcon } from "lucide-react";

export const FleetListLoading = () => (
  <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="flex min-h-14 items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const FleetListEmpty = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/8">
      <TruckIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">No trucks match your filters</p>
      <p className="mt-0.5 text-sm text-muted-foreground">Try clearing search or pick "All" in the filters.</p>
    </div>
  </div>
);
