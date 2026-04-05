import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import { MapPinIcon, NavigationIcon } from "lucide-react";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { formatDistanceKm } from "@/shared/lib/format";

export const DriverDashboardView = () => {
  const { data: tasks } = useTasks();
  const upcoming = tasks?.filter((t) => t.status !== "Completed" && t.status !== "Delivered").slice(0, 6) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My route</h1>
        <p className="text-muted-foreground">Next stop and assignments</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-sky-50">
              <NavigationIcon className="size-4 text-sky-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Current route</CardTitle>
              <CardDescription>Next: Warehouse B, Kyiv — ETA 14:30</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Route map placeholder
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-violet-50">
              <MapPinIcon className="size-4 text-violet-600" />
            </div>
            <CardTitle className="text-base font-semibold">Upcoming tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {upcoming.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No upcoming tasks</p>
          ) : (
            upcoming.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-1 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                <span className="font-semibold">{t.title}</span>
                <span className="text-muted-foreground">
                  {t.originLabel} → {t.destinationLabel} · {formatDistanceKm(t.distanceKm)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
