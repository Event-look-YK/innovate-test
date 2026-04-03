import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { formatDistanceKm } from "@/shared/lib/format";

export const DriverDashboardView = () => {
  const { data: tasks } = useTasks();
  const upcoming = tasks?.filter((t) => t.status !== "Completed" && t.status !== "Delivered").slice(0, 6) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My route</h1>
        <p className="text-muted-foreground">Next stop and assignments</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current route</CardTitle>
          <CardDescription>Next: Warehouse B, Kyiv — ETA 14:30</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Route map placeholder
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming tasks</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {upcoming.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <span className="font-medium">{t.title}</span>
              <span className="text-muted-foreground">
                {t.originLabel} → {t.destinationLabel} · {formatDistanceKm(t.distanceKm)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
