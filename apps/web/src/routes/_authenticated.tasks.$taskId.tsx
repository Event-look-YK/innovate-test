import { createFileRoute } from "@tanstack/react-router";

import { TaskDetailView } from "@/views/tasks/task-detail-view";

export const Route = createFileRoute("/_authenticated/tasks/$taskId")({
  component: TaskDetailView,
});
