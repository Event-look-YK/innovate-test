import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { NumberTicker } from "@innovate-test/ui/components/number-ticker";

import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export const WarehouseDashboardView = () => {
  const { data: stats } = useDashboardStats();
  const kpis = [
    { label: "Pending pickups", value: stats?.pendingTasks ?? 0, icon: "📦", color: "bg-amber-50 text-amber-600" },
    { label: "Loading now", value: stats?.inTransitTasks ?? 0, icon: "🔄", color: "bg-sky-50 text-sky-600" },
    { label: "Dispatched today", value: stats?.completedTasks ?? 0, icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Warehouse</h1>
        <p className="text-muted-foreground">Today&apos;s cargo flow</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-5">
              <div className="mb-2 flex items-center justify-between">
                <CardDescription className="font-medium">{k.label}</CardDescription>
                <div className={`flex size-8 items-center justify-center rounded-xl text-base ${k.color}`}>
                  {k.icon}
                </div>
              </div>
              <CardTitle className="text-4xl font-black tabular-nums">
                <NumberTicker value={k.value} />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card className="min-h-[200px] border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Today&apos;s cargo schedule</CardTitle>
          <CardDescription>Timeline placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Schedule timeline coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
