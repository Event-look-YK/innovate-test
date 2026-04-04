import { useState } from "react";
import { Skeleton } from "@innovate-test/ui/components/skeleton";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TasksBoardOrList } from "@/features/tasks/ui/tasks-board-or-list";
import { TasksPageToolbar } from "@/features/tasks/ui/tasks-page-toolbar";

const TasksLoading = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <Skeleton className="size-2.5 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export const TasksView = () => {
  const { data: tasks, isPending } = useTasks();
  const [mode, setMode] = useState<"board" | "list">("board");

  return (
    <div className="flex flex-col gap-4">
      <TasksPageToolbar mode={mode} onModeChange={setMode} />
      {isPending ? (
        <TasksLoading />
      ) : (
        <TasksBoardOrList mode={mode} tasks={tasks ?? []} />
      )}
    </div>
  );
};
