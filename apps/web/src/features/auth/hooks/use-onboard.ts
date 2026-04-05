import { useMutation, useQueryClient } from "@tanstack/react-query";

import { http } from "@/shared/lib/http";

type CarrierOnboardPayload = {
  role: "CARRIER_ADMIN";
  companyName: string;
  taxId: string;
  country: string;
  city: string;
};

type FreelanceOnboardPayload = {
  role: "FREELANCE_DRIVER";
  phone?: string;
  licenseNumber: string;
  vehicleType: "Truck" | "Van" | "Refrigerated";
  payloadT: number;
};

export type OnboardPayload = CarrierOnboardPayload | FreelanceOnboardPayload;

export const useOnboard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OnboardPayload) =>
      http.post<{ ok: boolean }>("/api/profile/onboard", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
