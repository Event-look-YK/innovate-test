import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { toast } from "sonner";

import {
  useRouteOfferStatus,
  useCreateRouteOffer,
  useCancelRouteOffer,
} from "@/features/routes/hooks/use-route-offer";

type Props = {
  routeId: string;
};

export const RouteOfferCard = ({ routeId }: Props) => {
  const { data: offer, isPending: loading } = useRouteOfferStatus(routeId);
  const createOffer = useCreateRouteOffer();
  const cancelOffer = useCancelRouteOffer();

  if (loading) return null;

  const handleCreate = () => {
    createOffer.mutate(routeId, {
      onSuccess: () => toast.success("Пропозицію створено"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleCancel = () => {
    cancelOffer.mutate(routeId, {
      onSuccess: () => toast.success("Пропозицію скасовано"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Freelance marketplace</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!offer && (
          <Button disabled={createOffer.isPending} type="button" onClick={handleCreate}>
            {createOffer.isPending ? "..." : "Запропонувати фрілансерам"}
          </Button>
        )}

        {offer?.status === "open" && (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                Пропозиція відкрита
              </span>
            </div>
            <Button
              disabled={cancelOffer.isPending}
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              {cancelOffer.isPending ? "..." : "Скасувати пропозицію"}
            </Button>
          </>
        )}

        {offer?.status === "accepted" && (
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                Прийнято
              </span>
            </div>
            {offer.driverName && (
              <p className="text-muted-foreground">
                {offer.driverName} · {offer.driverEmail}
              </p>
            )}
          </div>
        )}

        {offer?.status === "cancelled" && (
          <>
            <span className="inline-flex w-fit items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              Скасовано
            </span>
            <Button disabled={createOffer.isPending} type="button" onClick={handleCreate}>
              {createOffer.isPending ? "..." : "Запропонувати знову"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
