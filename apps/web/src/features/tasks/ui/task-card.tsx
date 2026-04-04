import { Link } from "@tanstack/react-router";
import { cn } from "@innovate-test/ui/lib/utils";

import { PriorityBadge } from "@/shared/ui/priority-badge";
import type { Task } from "@/shared/types/task";
import { formatDistanceKm } from "@/shared/lib/format";

type Props = {
  task: Task;
};

const statusLabel: Record<Task["status"], string> = {
  Pending: "Pending",
  Assigned: "Assigned",
  InTransit: "In transit",
  Delivered: "Delivered",
  Completed: "Completed",
};

export const TaskCard = ({ task }: Props) => (
  <Link params={{ taskId: task.id }} to="/tasks/$taskId">
    <div
      className={cn(
        "flex w-full box-border flex-col gap-1.5 rounded-lg bg-card p-3 text-sm ring-1 ring-border shadow-xs transition-shadow hover:shadow-md",
        task.priority === "EMERGENCY" && "ring-2 ring-destructive/40",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-xs text-muted-foreground">deadline {task.deadline}</span>
      </div>
      <p className="font-medium text-foreground">{task.title}</p>
      <p className="text-muted-foreground">
        {task.originLabel} → {task.destinationLabel} · {formatDistanceKm(task.distanceKm)}
      </p>
      <p className="text-xs text-muted-foreground">
        {statusLabel[task.status]}
        {task.assignedTruckId ? ` · Truck ${task.assignedTruckId}` : ""}
      </p>
    </div>
  </Link>
);
