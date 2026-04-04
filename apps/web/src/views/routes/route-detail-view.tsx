import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useRoutes } from "@/features/routes/hooks/use-routes";
import { RouteDetailMap, RouteDetailStopsCard } from "@/features/routes/ui/route-detail-layout";

export const RouteDetailView = () => {
  const { routeId } = useParams({ strict: false }) as { routeId: string };
  const { data: routes } = useRoutes();
  const route = routes?.find((r) => r.id === routeId);

  if (!route) {
    return <p className="text-muted-foreground">Route not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/routes">
        ← Routes
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        {route.truckName} · {route.id}
      </h1>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <RouteDetailMap route={route} />
        <RouteDetailStopsCard route={route} />
      </div>
    </div>
  );
};
