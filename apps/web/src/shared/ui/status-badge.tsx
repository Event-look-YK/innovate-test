import { cn } from "@innovate-test/ui/lib/utils";

import type { TaskStatus } from "@/shared/constants/task-status";

type Props = {
  status: TaskStatus | string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Assigned: "bg-violet-50 text-violet-700 ring-violet-200",
  InTransit: "bg-blue-50 text-blue-700 ring-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Completed: "bg-slate-50 text-slate-600 ring-slate-200",
  Cancelled: "bg-red-50 text-red-600 ring-red-200",
};

export const StatusBadge = ({ status, className }: Props) => (
  <span
    className={cn(
      "inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold tracking-wide ring-1",
      statusStyles[status] ?? "bg-muted text-muted-foreground ring-border",
      className,
    )}
  >
    {status === "InTransit" ? "In Transit" : status}
  </span>
);
