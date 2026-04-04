import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { TruckGpsCard } from "@/features/fleet/ui/truck-gps-card";
import { TruckTaskHistoryCard } from "@/features/fleet/ui/truck-task-history-card";
import { useTasks } from "@/features/tasks/hooks/use-tasks";

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
      <TruckGpsCard />
      <TruckTaskHistoryCard tasks={history} />
    </div>
  );
};
