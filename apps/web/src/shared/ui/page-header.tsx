import type { ReactNode } from "react";
import { cn } from "@innovate-test/ui/lib/utils";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export const PageHeader = ({ title, description, action, className }: Props) => (
  <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
    <div className="flex flex-col gap-0.5">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
