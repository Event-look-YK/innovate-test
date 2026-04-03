import { useQuery } from "@tanstack/react-query";

import { mockTrucks } from "@/features/fleet/lib/mock-data";

export const useFleet = () =>
  useQuery({
    queryKey: ["fleet"],
    queryFn: async () => mockTrucks,
  });
