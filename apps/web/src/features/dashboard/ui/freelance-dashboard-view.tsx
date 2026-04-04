import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { NumberTicker } from "@innovate-test/ui/components/number-ticker";
import { BriefcaseIcon, SparklesIcon, WalletIcon } from "lucide-react";

import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";

export const FreelanceDashboardView = () => {
  const { data: stats } = useDashboardStats();
  const kpis = [
    { label: "New offers", value: stats?.openOffers ?? 0, suffix: "", icon: SparklesIcon, color: "bg-violet-50 text-violet-600" },
    { label: "Active jobs", value: stats?.activeJobs ?? 0, suffix: "", icon: BriefcaseIcon, color: "bg-sky-50 text-sky-600" },
    { label: "Earnings", value: 0, suffix: " ₴", icon: WalletIcon, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Offers near you</h1>
        <p className="text-muted-foreground">Freight matching</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-5">
              <div className="mb-2 flex items-center justify-between">
                <CardDescription className="font-medium">{k.label}</CardDescription>
                <div className={`flex size-8 items-center justify-center rounded-xl ${k.color}`}>
                  <k.icon className="size-4" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black tabular-nums">
                <NumberTicker value={k.value} />{k.suffix}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Open offers</CardTitle>
          <CardDescription>Map + list placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Map preview coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
