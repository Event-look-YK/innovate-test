import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { cn } from "@innovate-test/ui/lib/utils";

import { useDemand } from "@/features/demand/hooks/use-demand";
import { formatCurrencyUah } from "@/shared/lib/format";

const mockFreelancers = [
  { id: "f1", name: "Taras K.", vehicle: "Refrigerated", distanceKm: 12, rating: 4.8, price: 17_000 },
  { id: "f2", name: "Nadia P.", vehicle: "Refrigerated", distanceKm: 28, rating: 4.6, price: 18_200 },
];

export const DemandDetailView = () => {
  const { requestId } = useParams({ strict: false }) as { requestId: string };
  const { data: rows } = useDemand();
  const row = rows?.find((r) => r.id === requestId);

  if (!row) {
    return <p className="text-muted-foreground">Request not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link className={cn(buttonVariants({ size: "sm", variant: "ghost" }))} to="/demand">
        ← Demand
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{row.taskTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            {row.truckType} · {row.payloadT} t · {row.routeLabel}
          </p>
          <p>Budget {formatCurrencyUah(row.budgetUah)}</p>
        </CardContent>
      </Card>
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Route map placeholder
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matched freelancers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {mockFreelancers.map((f) => (
            <div key={f.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-sm text-muted-foreground">
                  {f.vehicle} · {f.distanceKm} km · ★ {f.rating}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm">{formatCurrencyUah(f.price)}</span>
                <button className={cn(buttonVariants({ size: "sm" }))} type="button">
                  Send offer
                </button>
              </div>
            </div>
          ))}
          <button className={cn(buttonVariants({ variant: "outline" }))} type="button">
            Auto-send to best match
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
