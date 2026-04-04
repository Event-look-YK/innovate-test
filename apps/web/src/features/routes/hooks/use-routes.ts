import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { RouteOfferStatus } from "@/shared/types/offer";
import type {
  GenerateRoutesRequest,
  GenerateRoutesResponse,
  RoutePlan,
  RoutesResponse,
} from "@/shared/types/route";

type ListParams = {
  page?: number;
  limit?: number;
  status?: "draft" | "active" | "completed";
};

export const useRoutes = (params?: ListParams) =>
  useQuery({
    queryKey: ["routes", params],
    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 100),
      });
      if (params?.status) search.set("status", params.status);
      const response = await http.get<RoutesResponse>(`/api/routes?${search}`);
      return response.data;
    },
  });

export const useRoute = (routeId: string) =>
  useQuery({
    queryKey: ["routes", routeId],
    queryFn: () => http.get<RoutePlan>(`/api/routes/${routeId}`),
    enabled: !!routeId,
  });

export const useGenerateRoutes = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateRoutesRequest) =>
      http.post<GenerateRoutesResponse>("/api/routes/generate", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["fleet"] });
    },
  });
};

export const useUpdateRouteStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, status }: { routeId: string; status: "active" | "completed" }) =>
      http.patch<{ id: string; status: "active" | "completed" }>(`/api/routes/${routeId}/status`, {
        status,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["routes", variables.routeId] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["fleet"] });
    },
  });
};

export const useRouteOfferStatus = (routeId: string) =>
  useQuery({
    queryKey: ["routes", routeId, "offer"],
    queryFn: () => http.get<RouteOfferStatus>(`/api/routes/${routeId}/offer`),
    enabled: !!routeId,
  });

export const useCreateRouteOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) =>
      http.post<{ offerId: string; routePlanId: string; status: "open" }>(
        `/api/routes/${routeId}/offer`,
        {},
      ),
    onSuccess: (_data, routeId) => {
      qc.invalidateQueries({ queryKey: ["routes", routeId, "offer"] });
    },
  });
};

export const useCancelRouteOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: string) =>
      http.del<{ id: string; status: "cancelled" }>(`/api/routes/${routeId}/offer`),
    onSuccess: (_data, routeId) => {
      qc.invalidateQueries({ queryKey: ["routes", routeId, "offer"] });
    },
  });
};
