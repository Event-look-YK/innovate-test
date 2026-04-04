import { createFileRoute } from "@tanstack/react-router";

import { TeamView } from "@/views/team/team-view";

export const Route = createFileRoute("/_authenticated/team")({
  component: TeamView,
});
