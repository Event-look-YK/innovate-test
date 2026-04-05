import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { PaginatedResponse } from "@/shared/types/pagination";
import type { Truck } from "@/shared/types/truck";

type Params = {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
};

type CreateTruckPayload = {
  name: string;
  type: Truck["type"];
  payloadT: number;
  trackerId: string;
  locationLabel: string;
};

export const useFleet = (params?: Params) =>
  useQuery({
    queryKey: ["fleet", params],
    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 100),
      });
      if (params?.status) search.set("status", params.status);
      if (params?.type) search.set("type", params.type);
      const response = await http.get<PaginatedResponse<Truck>>(`/api/fleet?${search}`);
      return response.data;
    },
  });

export const useCreateTruck = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTruckPayload) => http.post<Truck>("/api/fleet", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fleet"] });
    },
  });
};

export const useTruck = (truckId: string) =>
  useQuery({
    queryKey: ["fleet", truckId],
    queryFn: () => http.get<Truck>(`/api/fleet/${truckId}`),
    enabled: !!truckId,
  });

type UpdateTruckPayload = Partial<{
  name: string;
  type: Truck["type"];
  payloadT: number;
  trailerId: string | null;
  trackerId: string;
  status: Truck["status"];
  locationLabel: string;
  assignedDriverId: string | null;
}> & { truckId: string };

export const useUpdateTruck = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ truckId, ...body }: UpdateTruckPayload) =>
      http.put<Truck>(`/api/fleet/${truckId}`, body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["fleet"] });
      qc.invalidateQueries({ queryKey: ["fleet", variables.truckId] });
    },
  });
};

export const useDeleteTruck = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (truckId: string) => http.del<{ success: boolean }>(`/api/fleet/${truckId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fleet"] });
    },
  });
};
