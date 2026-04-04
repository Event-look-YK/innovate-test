import { ListRowLink } from "@/shared/ui/list-row-link";
import { PriorityBadge } from "@/shared/ui/priority-badge";
import { StatusBadge } from "@/shared/ui/status-badge";
import type { Task } from "@/shared/types/task";
import { formatDistanceKm } from "@/shared/lib/format";

type Props = {
  tasks: Task[];
};

export const TaskList = ({ tasks }: Props) => (
  <div className="flex flex-col gap-2">
    {tasks.map((t) => (
      <ListRowLink
        key={t.id}
        badges={
          <span className="flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={t.priority} />
            <StatusBadge status={t.status} />
          </span>
        }
        footer={
          <>
            <span>Due {t.deadline}</span>
            <span>{t.cargoType}</span>
          </>
        }
        routeParams={{ taskId: t.id }}
        subtitle={
          <>
            {t.originLabel} → {t.destinationLabel}{" "}
            <span className="tabular-nums text-muted-foreground">({formatDistanceKm(t.distanceKm)})</span>
          </>
        }
        title={t.title}
        to="/tasks/$taskId"
      />
    ))}
  </div>
);
