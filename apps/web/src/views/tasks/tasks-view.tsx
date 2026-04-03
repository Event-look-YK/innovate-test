import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { TaskBoard } from "@/features/tasks/ui/task-board";
import { TaskTable } from "@/features/tasks/ui/task-table";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { Button, buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

export const TasksView = () => {
  const { data: tasks, isPending } = useTasks();
  const [mode, setMode] = useState<"board" | "table">("board");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Kanban or list</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <Button
              size="sm"
              type="button"
              variant={mode === "board" ? "secondary" : "ghost"}
              onClick={() => setMode("board")}
            >
              Board
            </Button>
            <Button
              size="sm"
              type="button"
              variant={mode === "table" ? "secondary" : "ghost"}
              onClick={() => setMode("table")}
            >
              Table
            </Button>
          </div>
          <Link className={cn(buttonVariants())} to="/tasks/new">
            New task
          </Link>
        </div>
      </div>
      {isPending ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : mode === "board" ? (
        <TaskBoard tasks={tasks ?? []} />
      ) : (
        <TaskTable tasks={tasks ?? []} />
      )}
    </div>
  );
};
