import { useQuery } from "@tanstack/react-query";

import { mockTeam } from "@/features/team/lib/mock-data";

export const useTeam = () =>
  useQuery({
    queryKey: ["team"],
    queryFn: async () => mockTeam,
  });
