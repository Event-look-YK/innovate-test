import { Badge } from "@innovate-test/ui/components/badge";
import { cn } from "@innovate-test/ui/lib/utils";

import type { TaskPriority } from "@/shared/constants/task-status";

type Props = {
  priority: TaskPriority;
  className?: string;
};

export const PriorityBadge = ({ priority, className }: Props) => (
  <Badge
    className={cn(
      "inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-bold tracking-wide",
      priority === "EMERGENCY" && "animate-pulse border-destructive bg-destructive text-destructive-foreground",
      priority === "HIGH" && "border-destructive/50 bg-destructive/15 text-destructive",
      priority === "MEDIUM" && "border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-400",
      priority === "LOW" && "border-border bg-muted text-muted-foreground",
      className,
    )}
    variant={priority === "LOW" ? "outline" : "secondary"}
  >
    {priority}
  </Badge>
);
