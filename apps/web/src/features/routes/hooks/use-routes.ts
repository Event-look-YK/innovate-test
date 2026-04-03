import { useQuery } from "@tanstack/react-query";

import { mockRoutes } from "@/features/routes/lib/mock-data";

export const useRoutes = () =>
  useQuery({
    queryKey: ["routes"],
    queryFn: async () => mockRoutes,
  });
