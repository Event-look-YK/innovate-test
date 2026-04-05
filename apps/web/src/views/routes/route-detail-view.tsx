import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useRoute } from "@/features/routes/hooks/use-routes";
import { RouteDetailMap, RouteDetailStopsCard } from "@/features/routes/ui/route-detail-layout";

export const RouteDetailView = () => {
  const { routeId } = useParams({ strict: false }) as { routeId: string };
  const { data: route, isPending } = useRoute(routeId);

  if (isPending) {
    return <p className="text-muted-foreground">Loading route...</p>;
  }

  if (!route) {
    return <p className="text-muted-foreground">Route not found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link className={cn("self-start", buttonVariants({ size: "sm", variant: "ghost" }))} to="/routes">
        ← Routes
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        {route.truckName ?? "Unknown truck"} · {route.id}
      </h1>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <RouteDetailMap route={route} />
        <RouteDetailStopsCard route={route} />
      </div>
    </div>
  );
};
