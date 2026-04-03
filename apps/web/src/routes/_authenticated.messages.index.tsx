import { createFileRoute } from "@tanstack/react-router";

import { MessagesIndexView } from "@/views/messages/messages-index-view";

export const Route = createFileRoute("/_authenticated/messages/")({
  component: MessagesIndexView,
});
