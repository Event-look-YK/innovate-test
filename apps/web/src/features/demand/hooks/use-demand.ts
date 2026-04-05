import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type {
  DemandRequestDetail,
  DemandRequestListItem,
  DemandRequestsResponse,
  DemandStatus,
} from "@/shared/types/demand";

type ListParams = {
  page?: number;
  limit?: number;
  status?: DemandStatus;
};

export const useDemand = (params?: ListParams) =>
  useQuery({
    queryKey: ["demand", params],
    queryFn: () => {
      const search = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 20),
      });
      if (params?.status) search.set("status", params.status);
      return http.get<DemandRequestsResponse>(`/api/demand?${search}`);
    },
  });

type CreateDemandPayload = {
  taskId?: string;
  requiredTruckType: "Truck" | "Semi" | "Refrigerated" | "Flatbed";
  cargoType: "General" | "Refrigerated" | "Hazardous" | "Oversized" | "Fragile";
  payloadT: number;
  originLabel: string;
  destinationLabel: string;
  deadline: string;
  budgetUah: number;
};

export const useCreateDemand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDemandPayload) =>
      http.post<DemandRequestListItem>("/api/demand", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["demand"] });
    },
  });
};

export const useDemandDetail = (requestId: string) =>
  useQuery({
    queryKey: ["demand", requestId],
    queryFn: () => http.get<DemandRequestDetail>(`/api/demand/${requestId}`),
    enabled: !!requestId,
  });
