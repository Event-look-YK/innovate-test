import { useQuery } from "@tanstack/react-query";

import { mockMessagesByThread, mockThreads } from "@/features/messages/lib/mock-data";

export const useThreads = () =>
  useQuery({
    queryKey: ["threads"],
    queryFn: async () => mockThreads,
  });

export const useThreadMessages = (threadId: string) =>
  useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => mockMessagesByThread[threadId] ?? [],
  });
