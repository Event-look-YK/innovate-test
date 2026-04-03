import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { PriorityBadge } from "@/shared/ui/priority-badge";
import type { Task } from "@/shared/types/task";
import { formatDistanceKm } from "@/shared/lib/format";

type Props = {
  tasks: Task[];
};

export const TaskTable = ({ tasks }: Props) => (
  <div className="rounded-lg border border-border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Open</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="font-medium">{t.title}</TableCell>
            <TableCell>
              {t.originLabel} → {t.destinationLabel} ({formatDistanceKm(t.distanceKm)})
            </TableCell>
            <TableCell>
              <PriorityBadge priority={t.priority} />
            </TableCell>
            <TableCell>{t.status}</TableCell>
            <TableCell className="text-end">
              <Link
                className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                params={{ taskId: t.id }}
                to="/tasks/$taskId"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
