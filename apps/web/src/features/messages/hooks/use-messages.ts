import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { MessageThread, ThreadMessage } from "@/shared/types/message";

export const useThreads = () =>
  useQuery({
    queryKey: ["threads"],
    queryFn: () => http.get<MessageThread[]>("/api/messages/threads"),
  });

export const useThreadMessages = (threadId: string) =>
  useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => http.get<ThreadMessage[]>(`/api/messages/threads/${threadId}`),
    enabled: !!threadId,
  });

type SendMessagePayload = {
  threadId: string;
  body: string;
};

export const useSendMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SendMessagePayload) =>
      http.post<{ id: string; threadId: string; body: string; status: "sent" }>(
        "/api/messages",
        body,
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["messages", variables.threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};
