import { useMutation, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { GenerateRoutesRequest, GenerateRoutesResponse } from "@/shared/types/route";

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
