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
