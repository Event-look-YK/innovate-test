import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@innovate-test/ui/lib/utils";

type Props = {
  to: string;
  routeParams?: Record<string, string | undefined>;
  search?: Record<string, unknown>;
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const ListRowLink = ({
  to,
  routeParams,
  search,
  leading,
  title,
  subtitle,
  badges,
  footer,
  className,
}: Props) => (
  <Link
    className={cn(
      "flex min-h-14 items-start gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm outline-none transition-colors",
      "hover:border-border hover:bg-muted/25",
      "active:bg-muted/40",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
    {...({ params: routeParams, search, to } as ComponentProps<typeof Link>)}
  >
    {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-medium text-foreground">{title}</span>
        {badges}
      </div>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      {footer ? <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">{footer}</div> : null}
    </div>
    <ChevronRightIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground/45" aria-hidden />
  </Link>
);

type StaticProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const ListRowCard = ({ leading, title, subtitle, badges, footer, className }: StaticProps) => (
  <div
    className={cn(
      "flex min-h-14 items-start gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm",
      className,
    )}
  >
    {leading ? <div className="shrink-0 pt-0.5">{leading}</div> : null}
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-medium text-foreground">{title}</span>
        {badges}
      </div>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      {footer ? <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">{footer}</div> : null}
    </div>
  </div>
);
