import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { useRoutes } from "@/features/routes/hooks/use-routes";

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
        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          Full-screen map placeholder
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stops</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {route.stops.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-border p-3">
                <p className="font-medium">
                  {i + 1}. {s.label}
                </p>
                <p className="text-muted-foreground">{s.eta}</p>
                <p className="text-xs text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
