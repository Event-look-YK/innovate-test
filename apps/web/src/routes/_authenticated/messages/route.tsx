import { createFileRoute } from "@tanstack/react-router";

import { MessagesLayout } from "@/features/messages/ui/messages-layout";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesLayout,
});
