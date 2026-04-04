import { useQuery } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { RoutePlan } from "@/shared/types/route";

export const useRoute = (routeId: string) =>
  useQuery({
    queryKey: ["routes", routeId],
    queryFn: () => http.get<RoutePlan>(`/api/routes/${routeId}`),
    enabled: !!routeId,
  });
