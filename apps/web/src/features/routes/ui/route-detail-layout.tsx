import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import type { RoutePlan } from "@/shared/types/route";
import { RouteMap } from "@/shared/ui/route-map";

type Props = {
  route: RoutePlan;
};

export const RouteDetailMap = ({ route }: Props) => {
  const locations = route.stops.map((s) => s.label);
  return <RouteMap locations={locations} className="min-h-[360px]" />;
};

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
