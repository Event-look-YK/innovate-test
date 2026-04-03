import { createFileRoute } from "@tanstack/react-router";

import { InviteView } from "@/views/team/invite-view";

export const Route = createFileRoute("/_authenticated/team/invite")({
  component: InviteView,
});
