import { useParams } from "@tanstack/react-router";

import { useThreadMessages } from "@/features/messages/hooks/use-messages";
import { MessagesThreadPanel } from "@/features/messages/ui/messages-thread-panel";

export const MessagesThreadView = () => {
  const { threadId } = useParams({ strict: false }) as { threadId: string };
  const { data: messages } = useThreadMessages(threadId);

  return <MessagesThreadPanel messages={messages} />;
};
