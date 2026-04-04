import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

type Props = {
  mode: "board" | "list";
  onModeChange: (mode: "board" | "list") => void;
};

export const TasksPageToolbar = ({ mode, onModeChange }: Props) => (
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
          onClick={() => onModeChange("board")}
        >
          Board
        </Button>
        <Button
          size="sm"
          type="button"
          variant={mode === "list" ? "secondary" : "ghost"}
          onClick={() => onModeChange("list")}
        >
          List
        </Button>
      </div>
      <Link className={cn(buttonVariants(), "min-h-10 w-full justify-center sm:w-auto")} to="/tasks/new">
        New task
      </Link>
    </div>
  </div>
);
