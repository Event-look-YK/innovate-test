import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
};

export const TaskDetailHeader = ({ task }: Props) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-wrap items-center gap-2">
      <PriorityBadge priority={task.priority} />
      <StatusBadge status={task.status} />
    </div>
    <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
    <p className="text-muted-foreground">Deadline {task.deadline}</p>
  </div>
);
