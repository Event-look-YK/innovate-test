import { TaskForm } from "@/features/tasks/ui/task-form";

export const TaskCreateView = () => (
  <div className="flex flex-col gap-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
      <p className="text-muted-foreground">Cargo and corridor</p>
    </div>
    <TaskForm />
  </div>
);
