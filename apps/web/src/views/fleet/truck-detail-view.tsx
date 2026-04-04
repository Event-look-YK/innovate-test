import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { ListRowLink } from "@/shared/ui/list-row-link";
import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";

export const TruckDetailView = () => {
  const { truckId } = useParams({ strict: false }) as { truckId: string };
  const { data: trucks } = useFleet();
  const { data: tasks } = useTasks();
  const truck = trucks?.find((t) => t.id === truckId);
  const history = tasks?.filter((t) => t.assignedTruckId === truckId) ?? [];

  if (!truck) {
    return <p className="text-muted-foreground">Truck not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "w-fit -ml-2")} to="/fleet">
          ← Fleet
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{truck.name}</h1>
          <p className="text-sm text-muted-foreground">
            {truck.type} · {truck.payloadT} t · {truck.status.replace("_", " ")}
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GPS trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground">
            Last 24h path (Mapbox placeholder)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task history</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-0">
          {history.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No tasks assigned to this truck yet.</p>
          ) : (
            history.map((t) => (
              <ListRowLink
                key={t.id}
                badges={
                  <span className="flex flex-wrap gap-1.5">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </span>
                }
                routeParams={{ taskId: t.id }}
                subtitle={`${t.originLabel} → ${t.destinationLabel}`}
                title={t.title}
                to="/tasks/$taskId"
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
