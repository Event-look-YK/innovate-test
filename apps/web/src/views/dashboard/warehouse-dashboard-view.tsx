import { Card, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

const kpis = [
  { label: "Pending pickups", value: "6" },
  { label: "Loading now", value: "2" },
  { label: "Dispatched today", value: "11" },
];

export const WarehouseDashboardView = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Warehouse</h1>
      <p className="text-muted-foreground">Today&apos;s cargo flow</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardHeader className="pb-2">
            <CardDescription>{k.label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">{k.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
    <Card className="min-h-[200px]">
      <CardHeader>
        <CardTitle className="text-base">Today&apos;s cargo schedule</CardTitle>
        <CardDescription>Timeline placeholder</CardDescription>
      </CardHeader>
    </Card>
  </div>
);
