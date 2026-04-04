import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { formatDuration } from "@/shared/lib/format";
import type { MarketplaceOfferDetail, MarketplaceOfferStop, MarketplaceOfferTask } from "@/shared/types/offer";

type DetailProps = {
  offer: MarketplaceOfferDetail;
};

export const OfferDetailRouteCard = ({ offer }: DetailProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Route info</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p>
        <span className="font-medium text-foreground">{offer.companyName}</span>
        {offer.triggerType === "auto" ? " · Auto-offered" : " · Manual offer"}
      </p>
      <p>{offer.distanceKm} km · {formatDuration(offer.durationHours)}</p>
      <p>Load: {offer.loadT} / {offer.capacityT} t</p>
    </CardContent>
  </Card>
);

type StopsProps = {
  stops: MarketplaceOfferStop[];
};

export const OfferDetailStopsTimeline = ({ stops }: StopsProps) => {
  const sorted = [...stops].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stops</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 text-sm">
        {sorted.map((s, i) => (
          <div key={s.id} className="flex gap-3">
            <div className="flex flex-col items-center pt-1.5">
              <div className="size-2.5 shrink-0 rounded-full bg-primary ring-2 ring-background" />
              {i < sorted.length - 1 && <div className="mt-1 w-px flex-1 bg-border/50" />}
            </div>
            <div className={cn("min-w-0 flex-1", i < sorted.length - 1 ? "pb-4" : "pb-0")}>
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(s.eta).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" })}
              </p>
              {s.note && <p className="text-xs text-muted-foreground">{s.note}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const priorityColor: Record<string, string> = {
  EMERGENCY: "bg-red-50 text-red-700",
  HIGH: "bg-orange-50 text-orange-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-slate-50 text-slate-600",
};

const cargoColor: Record<string, string> = {
  General: "bg-blue-50 text-blue-700",
  Refrigerated: "bg-cyan-50 text-cyan-700",
  Hazardous: "bg-red-50 text-red-700",
  Oversized: "bg-purple-50 text-purple-700",
  Fragile: "bg-amber-50 text-amber-700",
};

type TasksProps = {
  tasks: MarketplaceOfferTask[];
};

export const OfferDetailTasksList = ({ tasks }: TasksProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Cargo tasks ({tasks.length})</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm">
      {tasks.map((t) => (
        <div key={t.id} className="rounded-lg border border-border p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">{t.title}</p>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", cargoColor[t.cargoType] ?? "bg-muted text-muted-foreground")}>
              {t.cargoType}
            </span>
          </div>
          <p className="text-muted-foreground">
            {t.originLabel} → {t.destinationLabel} · {t.weightT} t
          </p>
          <div className="mt-1 flex gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", priorityColor[t.priority] ?? "bg-muted text-muted-foreground")}>
              {t.priority}
            </span>
            <span className="text-xs text-muted-foreground">
              Due {new Date(t.deadline).toLocaleDateString("uk-UA")}
            </span>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);
