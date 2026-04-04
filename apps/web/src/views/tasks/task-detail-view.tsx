import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useTask } from "@/features/tasks/hooks/use-tasks";
import { TaskDetailAssignmentCard } from "@/features/tasks/ui/task-detail-assignment-card";
import { TaskDetailCargoCard } from "@/features/tasks/ui/task-detail-cargo-card";
import { TaskDetailHeader } from "@/features/tasks/ui/task-detail-header";
import { TaskDetailRouteCard } from "@/features/tasks/ui/task-detail-route-card";
import { TaskDetailThreadCard } from "@/features/tasks/ui/task-detail-thread-card";
import { TaskDetailTimelineCard } from "@/features/tasks/ui/task-detail-timeline-card";

export const TaskDetailView = () => {
  const { taskId } = useParams({ strict: false }) as { taskId: string };
  const { data: task, isPending } = useTask(taskId);

  if (isPending) {
    return <p className="text-muted-foreground">Loading task...</p>;
  }

  if (!task) {
    return <p className="text-muted-foreground">Task not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/tasks">
        ← Tasks
      </Link>
      <TaskDetailHeader task={task} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TaskDetailCargoCard task={task} />
        <TaskDetailRouteCard task={task} />
      </div>
      <TaskDetailAssignmentCard task={task} />
      <TaskDetailTimelineCard />
      <TaskDetailThreadCard />
    </div>
  );
};
