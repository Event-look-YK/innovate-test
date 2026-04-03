import { createFileRoute } from "@tanstack/react-router";

import { TaskCreateView } from "@/views/tasks/task-create-view";

export const Route = createFileRoute("/_authenticated/tasks/new")({
  component: TaskCreateView,
});
