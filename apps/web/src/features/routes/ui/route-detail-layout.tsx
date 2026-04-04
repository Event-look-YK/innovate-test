import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import type { RoutePlan } from "@/shared/types/route";

type Props = {
  route: RoutePlan;
};

export const RouteDetailMapPlaceholder = () => (
  <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
    Full-screen map placeholder
  </div>
);

export const RouteDetailStopsCard = ({ route }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Stops</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-3 text-sm">
      {route.stops.map((s, i) => (
        <div key={s.id} className="rounded-lg border border-border p-3">
          <p className="font-medium">
            {i + 1}. {s.label}
          </p>
          <p className="text-muted-foreground">{s.eta}</p>
          <p className="text-xs text-muted-foreground">{s.note}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);
