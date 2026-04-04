import { useQuery } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type {
  DemandRequestDetail,
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

export const useDemandDetail = (requestId: string) =>
  useQuery({
    queryKey: ["demand", requestId],
    queryFn: () => http.get<DemandRequestDetail>(`/api/demand/${requestId}`),
    enabled: !!requestId,
  });
