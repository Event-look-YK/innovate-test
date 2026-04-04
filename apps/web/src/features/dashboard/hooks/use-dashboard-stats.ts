import { useQuery } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";
import type { DashboardStats } from "@/shared/types/profile";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => http.get<DashboardStats>("/api/dashboard/stats"),
  });
