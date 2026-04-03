import { useQuery } from "@tanstack/react-query";

import { mockOffers } from "@/features/offers/lib/mock-data";

export const useOffers = () =>
  useQuery({
    queryKey: ["offers"],
    queryFn: async () => mockOffers,
  });
