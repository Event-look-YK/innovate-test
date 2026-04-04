import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { CreateRouteOfferResponse, RouteOfferStatus } from "@/shared/types/offer";

export const useRouteOfferStatus = (routeId: string) =>
  useQuery({
    queryKey: ["routes", routeId, "offer"],
    queryFn: async () => {
      try {
        return await http.get<RouteOfferStatus>(`/api/routes/${routeId}/offer`);
      } catch {
        return null;
      }
    },
    enabled: !!routeId,
  });

export const useCreateRouteOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) =>
      http.post<CreateRouteOfferResponse>(`/api/routes/${routeId}/offer`, {}),
    onSuccess: (_data, routeId) => {
      qc.invalidateQueries({ queryKey: ["routes", routeId, "offer"] });
    },
  });
};

export const useCancelRouteOffer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) =>
      http.del<{ id: string; status: string }>(`/api/routes/${routeId}/offer`),
    onSuccess: (_data, routeId) => {
      qc.invalidateQueries({ queryKey: ["routes", routeId, "offer"] });
    },
  });
};
