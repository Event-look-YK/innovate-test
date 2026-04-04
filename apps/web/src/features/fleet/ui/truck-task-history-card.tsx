import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { ListRowLink } from "@/shared/ui/list-row-link";
import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { Task } from "@/shared/types/task";

type Props = {
  tasks: Task[];
};

export const TruckTaskHistoryCard = ({ tasks }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Task history</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 pt-0">
      {tasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No tasks assigned to this truck yet.</p>
      ) : (
        tasks.map((t) => (
          <ListRowLink
            key={t.id}
            badges={
              <span className="flex flex-wrap gap-1.5">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </span>
            }
            routeParams={{ taskId: t.id }}
            subtitle={`${t.originLabel} → ${t.destinationLabel}`}
            title={t.title}
            to="/tasks/$taskId"
          />
        ))
      )}
    </CardContent>
  </Card>
);
