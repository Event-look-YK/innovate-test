import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { NotificationsResponse } from "@/shared/types/notification";

export const useNotifications = (page = 1) =>
  useQuery({
    queryKey: ["notifications", { page }],
    queryFn: () =>
      http.get<NotificationsResponse>(`/api/notifications?page=${page}&limit=20`),
    refetchInterval: 30_000,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: ["notifications", { page: 1 }],
    queryFn: () =>
      http.get<NotificationsResponse>("/api/notifications?page=1&limit=1"),
    select: (data) => data.unreadCount,
    refetchInterval: 30_000,
  });

export const useMarkRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      http.patch<{ id: string; readAt: string }>(`/api/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => http.post<{ ok: boolean }>("/api/notifications/read-all", {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
