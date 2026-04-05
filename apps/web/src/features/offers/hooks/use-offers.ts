import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { http } from "@/shared/lib/http";
import type {
  AcceptOfferResponse,
  FreightOfferListItem,
  MarketplaceOffer,
  MarketplaceOfferDetail,
} from "@/shared/types/offer";
import type { PaginatedResponse } from "@/shared/types/pagination";

export const useMarketplaceOffers = (page = 1) =>
  useQuery({
    queryKey: ["marketplace", "offers", { page }],
    queryFn: () =>
      http.get<PaginatedResponse<MarketplaceOffer>>(
        `/api/marketplace/routes?page=${page}&limit=20`,
      ),
  });

export const useMarketplaceOfferDetail = (offerId: string) =>
  useQuery({
    queryKey: ["marketplace", "offers", offerId],
    queryFn: () => http.get<MarketplaceOfferDetail>(`/api/marketplace/routes/${offerId}`),
    enabled: !!offerId,
  });

export const useAcceptOffer = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (offerId: string) =>
      http.post<AcceptOfferResponse>(`/api/marketplace/routes/${offerId}/accept`, {}),
    onSuccess: () => {
      toast.success("Маршрут прийнятий! Перевірте деталі.");
      qc.invalidateQueries({ queryKey: ["marketplace"] });
      navigate({ to: "/offers" });
    },
    onError: (err) => {
      if (err.message.includes("already accepted") || err.message.includes("cancelled")) {
        toast.error("На жаль, цей маршрут вже зайнятий. Оберіть інший.");
        qc.invalidateQueries({ queryKey: ["marketplace"] });
      } else {
        toast.error(err.message);
      }
    },
  });
};

export const useDemandOffers = (demandRequestId: string) =>
  useQuery({
    queryKey: ["demand", demandRequestId, "offers"],
    queryFn: () =>
      http.get<FreightOfferListItem[]>(
        `/api/offers?demandRequestId=${encodeURIComponent(demandRequestId)}`,
      ),
    enabled: !!demandRequestId,
  });

export const useCreateFreightOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      demandRequestId: string;
      offeredPriceUah: number;
      estimatedHours?: number;
      note?: string;
    }) => http.post<FreightOfferListItem>("/api/offers", body),
    onSuccess: (_data, variables) => {
      toast.success("Offer sent");
      qc.invalidateQueries({
        queryKey: ["demand", variables.demandRequestId, "offers"],
      });
      qc.invalidateQueries({ queryKey: ["demand"] });
    },
  });
};

export const useFreightOffer = (offerId: string) =>
  useQuery({
    queryKey: ["offers", offerId],
    queryFn: () => http.get<FreightOfferListItem>(`/api/offers/${offerId}`),
    enabled: !!offerId,
  });

export const useAcceptFreightOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) =>
      http.post<{ id: string; status: string }>(
        `/api/offers/${offerId}/accept`,
        {},
      ),
    onSuccess: () => {
      toast.success("Offer accepted");
      qc.invalidateQueries({ queryKey: ["demand"] });
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useDeclineFreightOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) =>
      http.post<{ id: string; status: string }>(
        `/api/offers/${offerId}/decline`,
        {},
      ),
    onSuccess: () => {
      toast.success("Offer declined");
      qc.invalidateQueries({ queryKey: ["demand"] });
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

export const useCounterFreightOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      offerId,
      ...body
    }: {
      offerId: string;
      offeredPriceUah: number;
      note?: string;
    }) =>
      http.post<FreightOfferListItem>(
        `/api/offers/${offerId}/counter`,
        body,
      ),
    onSuccess: () => {
      toast.success("Counter-offer sent");
      qc.invalidateQueries({ queryKey: ["demand"] });
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};
