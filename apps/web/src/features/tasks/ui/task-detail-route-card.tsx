import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatDistanceKm } from "@/shared/lib/format";
import { RouteMap } from "@/shared/ui/route-map";
import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
};

export const TaskDetailRouteCard = ({ task }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Route</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm">
      <p>
        {task.originLabel} → {task.destinationLabel}
      </p>
      <p className="text-muted-foreground">{formatDistanceKm(task.distanceKm)}</p>
      <RouteMap locations={[task.originLabel, task.destinationLabel]} className="mt-2 min-h-[200px]" />
    </CardContent>
  </Card>
);
