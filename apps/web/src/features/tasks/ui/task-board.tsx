import { TASK_STATUSES, type TaskStatus } from "@/shared/constants/task-status";
import { TaskCard } from "@/features/tasks/ui/task-card";
import type { Task } from "@/shared/types/task";

const columnTitle: Record<TaskStatus, string> = {
  Pending: "Pending",
  Assigned: "Assigned",
  InTransit: "In transit",
  Delivered: "Delivered",
  Completed: "Completed",
};

type Props = {
  tasks: Task[];
};

export const TaskBoard = ({ tasks }: Props) => (
  <div className="flex gap-4 overflow-x-auto pb-2">
    {TASK_STATUSES.map((status) => {
      const col = tasks.filter((t) => t.status === status);
      return (
        <div key={status} className="flex w-72 min-w-72 shrink-0 flex-col gap-3 px-1">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
            <span className="text-sm font-medium">{columnTitle[status]}</span>
            <span className="text-xs text-muted-foreground">{col.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {col.map((t) => (
              <TaskCard key={t.id} task={t} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);
