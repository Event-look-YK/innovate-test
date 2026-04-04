import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatDistanceKm } from "@/shared/lib/format";
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
      <div className="mt-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
        Mini map placeholder
      </div>
    </CardContent>
  </Card>
);
