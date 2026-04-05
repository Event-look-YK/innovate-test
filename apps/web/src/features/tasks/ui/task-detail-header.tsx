import { Button } from "@innovate-test/ui/components/button";
import { toast } from "sonner";

import { useUpdateTaskStatus } from "@/features/tasks/hooks/use-tasks";
import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { Task } from "@/shared/types/task";
import type { TaskStatus } from "@/shared/constants/task-status";

const STATUS_TRANSITIONS: Partial<Record<TaskStatus, TaskStatus>> = {
  Pending: "Assigned",
  Assigned: "InTransit",
  InTransit: "Delivered",
  Delivered: "Completed",
};

type Props = {
  task: Task;
};

export const TaskDetailHeader = ({ task }: Props) => {
  const updateStatus = useUpdateTaskStatus();
  const nextStatus = STATUS_TRANSITIONS[task.status];

  const handleStatusChange = async () => {
    if (!nextStatus) return;
    try {
      await updateStatus.mutateAsync({ taskId: task.id, status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        {nextStatus && (
          <Button
            disabled={updateStatus.isPending}
            size="sm"
            variant="outline"
            onClick={handleStatusChange}
          >
            {updateStatus.isPending ? "Updating..." : `Move to ${nextStatus}`}
          </Button>
        )}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
      <p className="text-muted-foreground">Deadline {task.deadline}</p>
    </div>
  );
};
