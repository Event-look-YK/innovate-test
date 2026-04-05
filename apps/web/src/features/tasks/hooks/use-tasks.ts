import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Task } from "@/shared/types/task";

type ListParams = {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
};

type CreateTaskPayload = {
  title: string;
  cargoDescription: string;
  cargoType: Task["cargoType"];
  weightT: number;
  originLabel: string;
  destinationLabel: string;
  deadline: string;
  priority: Task["priority"];
  assignedTruckId?: string | null;
  notes?: string;
};

export const useTasks = (params?: ListParams) =>
  useQuery({
    queryKey: ["tasks", params],
    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 100),
      });
      if (params?.status) search.set("status", params.status);
      if (params?.priority) search.set("priority", params.priority);
      const response = await http.get<PaginatedResponse<Task>>(`/api/tasks?${search}`);
      return response.data;
    },
  });

export const useTask = (taskId: string) =>
  useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => http.get<Task>(`/api/tasks/${taskId}`),
    enabled: !!taskId,
  });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTaskPayload) => http.post<Task>("/api/tasks", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

type UpdateTaskPayload = Partial<CreateTaskPayload> & { taskId: string };

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...body }: UpdateTaskPayload) =>
      http.put<Task>(`/api/tasks/${taskId}`, body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      http.patch<{ id: string; status: string }>(`/api/tasks/${taskId}/status`, { status }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
    },
  });
};
