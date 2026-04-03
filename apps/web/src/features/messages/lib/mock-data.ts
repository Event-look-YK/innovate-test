export type Thread = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  sentAt: string;
  status: "sent" | "delivered" | "read" | "queued";
};

export const mockThreads: Thread[] = [
  { id: "th1", title: "Steel coils delivery", lastMessage: "ETA updated", updatedAt: "10:12" },
  { id: "th2", title: "Direct · Manager", lastMessage: "Thanks", updatedAt: "Yesterday" },
];

export const mockMessagesByThread: Record<string, Message[]> = {
  th1: [
    {
      id: "m1",
      threadId: "th1",
      author: "Dispatcher",
      body: "Please confirm loading at Uman.",
      sentAt: "09:40",
      status: "read",
    },
    {
      id: "m2",
      threadId: "th1",
      author: "You",
      body: "Loaded, departing now.",
      sentAt: "09:55",
      status: "delivered",
    },
  ],
  th2: [
    {
      id: "m3",
      threadId: "th2",
      author: "Manager",
      body: "Route approved.",
      sentAt: "Mon",
      status: "read",
    },
  ],
};
