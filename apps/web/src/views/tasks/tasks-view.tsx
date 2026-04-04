import { useState } from "react";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { TasksBoardOrList } from "@/features/tasks/ui/tasks-board-or-list";
import { TasksPageToolbar } from "@/features/tasks/ui/tasks-page-toolbar";

export const TasksView = () => {
  const { data: tasks, isPending } = useTasks();
  const [mode, setMode] = useState<"board" | "list">("board");

  return (
    <div className="flex flex-col gap-4">
      <TasksPageToolbar mode={mode} onModeChange={setMode} />
      {isPending ? (
        <p className="text-center text-sm text-muted-foreground sm:text-left">Loading…</p>
      ) : (
        <TasksBoardOrList mode={mode} tasks={tasks ?? []} />
      )}
    </div>
  );
};
