import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Button, buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { toast } from "sonner";

import { useDeleteTruck, useTruck } from "@/features/fleet/hooks/use-fleet";
import { TruckEditDialog } from "@/features/fleet/ui/truck-edit-dialog";
import { TruckGpsCard } from "@/features/fleet/ui/truck-gps-card";
import { TruckTaskHistoryCard } from "@/features/fleet/ui/truck-task-history-card";
import { useTasks } from "@/features/tasks/hooks/use-tasks";

export const TruckDetailView = () => {
  const { truckId } = useParams({ strict: false }) as { truckId: string };
  const { data: truck, isPending } = useTruck(truckId);
  const { data: tasks } = useTasks();
  const history = tasks?.filter((t) => t.assignedTruckId === truckId) ?? [];
  const navigate = useNavigate();
  const deleteTruck = useDeleteTruck();
  const [editOpen, setEditOpen] = useState(false);

  if (isPending) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!truck) {
    return <p className="text-muted-foreground">Truck not found.</p>;
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${truck.name}"?`)) return;
    try {
      await deleteTruck.mutateAsync(truckId);
      toast.success("Truck deleted");
      navigate({ to: "/fleet" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete truck");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "w-fit -ml-2")} to="/fleet">
          ← Fleet
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{truck.name}</h1>
            <p className="text-sm text-muted-foreground">
              {truck.type} · {truck.payloadT} t · {truck.status.replace("_", " ")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={deleteTruck.isPending}
              onClick={handleDelete}
            >
              {deleteTruck.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
      <TruckGpsCard locationLabel={truck.locationLabel} />
      <TruckTaskHistoryCard tasks={history} />
      <TruckEditDialog open={editOpen} onOpenChange={setEditOpen} truck={truck} />
    </div>
  );
};
