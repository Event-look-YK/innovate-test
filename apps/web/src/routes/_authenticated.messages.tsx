import { createFileRoute } from "@tanstack/react-router";

import { MessagesLayout } from "@/views/messages/messages-layout";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesLayout,
});
