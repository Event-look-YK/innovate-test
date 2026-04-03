import { useQuery } from "@tanstack/react-query";

import { mockDemand } from "@/features/demand/lib/mock-data";

export const useDemand = () =>
  useQuery({
    queryKey: ["demand"],
    queryFn: async () => mockDemand,
  });
