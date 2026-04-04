import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { TaskBoard } from "@/features/tasks/ui/task-board";
import { TaskList } from "@/features/tasks/ui/task-list";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { Button, buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

export const TasksView = () => {
  const { data: tasks, isPending } = useTasks();
  const [mode, setMode] = useState<"board" | "list">("board");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground md:hidden">Swipe-friendly list</p>
          <p className="hidden text-sm text-muted-foreground md:block">Kanban or list</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <div className="hidden rounded-lg border border-border/80 p-0.5 md:flex">
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
              variant={mode === "list" ? "secondary" : "ghost"}
              onClick={() => setMode("list")}
            >
              List
            </Button>
          </div>
          <Link className={cn(buttonVariants(), "min-h-10 w-full justify-center sm:w-auto")} to="/tasks/new">
            New task
          </Link>
        </div>
      </div>

      {isPending ? (
        <p className="text-center text-sm text-muted-foreground sm:text-left">Loading…</p>
      ) : (
        <>
          <div className="md:hidden">
            {tasks?.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                No tasks yet. Create one to get started.
              </p>
            ) : (
              <TaskList tasks={tasks ?? []} />
            )}
          </div>
          <div className="hidden md:block">
            {tasks?.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                No tasks yet. Create one to get started.
              </p>
            ) : mode === "board" ? (
              <TaskBoard tasks={tasks ?? []} />
            ) : (
              <TaskList tasks={tasks ?? []} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
