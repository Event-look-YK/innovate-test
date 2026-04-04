import { createFileRoute } from "@tanstack/react-router";

import { TasksView } from "@/views/tasks/tasks-view";

export const Route = createFileRoute("/_authenticated/tasks/")({
  component: TasksView,
});
