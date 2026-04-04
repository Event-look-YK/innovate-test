import { TaskBoard } from "@/features/tasks/ui/task-board";
import { TaskList } from "@/features/tasks/ui/task-list";
import type { Task } from "@/shared/types/task";

type Props = {
  tasks: Task[];
  mode: "board" | "list";
};

const TasksEmpty = () => (
  <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
    No tasks yet. Create one to get started.
  </p>
);

export const TasksBoardOrList = ({ tasks, mode }: Props) => {
  if (tasks.length === 0) {
    return <TasksEmpty />;
  }
  return (
    <>
      <div className="md:hidden">
        <TaskList tasks={tasks} />
      </div>
      <div className="hidden md:block">{mode === "board" ? <TaskBoard tasks={tasks} /> : <TaskList tasks={tasks} />}</div>
    </>
  );
};
