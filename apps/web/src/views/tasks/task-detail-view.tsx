import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TaskTimeline } from "@/features/tasks/ui/task-timeline";
import { formatDistanceKm, formatWeightT } from "@/shared/lib/format";
import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";

export const TaskDetailView = () => {
  const { taskId } = useParams({ strict: false }) as { taskId: string };
  const { data: tasks } = useTasks();
  const task = tasks?.find((t) => t.id === taskId);

  if (!task) {
    return <p className="text-muted-foreground">Task not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/tasks">
        ← Tasks
      </Link>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
        <p className="text-muted-foreground">Deadline {task.deadline}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cargo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>{task.cargoDescription}</p>
            <p className="text-muted-foreground">
              {task.cargoType} · {formatWeightT(task.weightT)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Route</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              {task.originLabel} → {task.destinationLabel}
            </p>
            <p className="text-muted-foreground">{formatDistanceKm(task.distanceKm)}</p>
            <div className="mt-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
              Mini map placeholder
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignment</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {task.assignedTruckId ? `Truck ${task.assignedTruckId}` : "Unassigned"}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskTimeline />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thread</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Linked messages (offline-capable) — mock</CardContent>
      </Card>
    </div>
  );
};
