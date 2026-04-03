import { Card, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatCurrencyUah } from "@/shared/lib/format";

const kpis = [
  { label: "New offers", value: "3" },
  { label: "Active jobs", value: "1" },
  { label: "Earnings", value: formatCurrencyUah(12_400) },
];

export const FreelanceDashboardView = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Offers near you</h1>
      <p className="text-muted-foreground">Freight matching</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {kpis.map((k) => (
        <Card key={k.label}>
          <CardHeader className="pb-2">
            <CardDescription>{k.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{k.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Open offers</CardTitle>
        <CardDescription>Map + list placeholder</CardDescription>
      </CardHeader>
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        Map preview
      </div>
    </Card>
  </div>
);
