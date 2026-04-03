import { useQuery } from "@tanstack/react-query";

import { mockTasks } from "@/features/tasks/lib/mock-data";

export const useTasks = () =>
  useQuery({
    queryKey: ["tasks"],
    queryFn: async () => mockTasks,
  });
