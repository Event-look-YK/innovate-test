import { createFileRoute } from "@tanstack/react-router";

import { MessagesThreadView } from "@/views/messages/messages-thread-view";

export const Route = createFileRoute("/_authenticated/messages/$threadId")({
  component: MessagesThreadView,
});
