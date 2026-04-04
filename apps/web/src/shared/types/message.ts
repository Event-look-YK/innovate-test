export type MessageThreadType = "task" | "direct" | "group";

export type MessageThread = {
  id: string;
  type: MessageThreadType;
  title: string;
  lastMessage: string | null;
  updatedAt: string;
};

export type ThreadMessage = {
  id: string;
  threadId: string;
  author: string;
  authorId: string;
  body: string;
  sentAt: string;
  status: "sent" | "read";
};
