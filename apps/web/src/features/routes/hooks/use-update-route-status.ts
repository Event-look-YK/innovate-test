import { useMutation, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";

type Params = {
  routeId: string;
  status: "active" | "completed";
};

export const useUpdateRouteStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, status }: Params) =>
      http.patch<{ id: string; status: string }>(`/api/routes/${routeId}/status`, { status }),
    onSuccess: (_data, { routeId }) => {
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["routes", routeId] });
      qc.invalidateQueries({ queryKey: ["fleet"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
