import { Skeleton } from "@innovate-test/ui/components/skeleton";
import { UsersIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

export const TeamListLoading = () => (
  <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    ))}
  </div>
);

export const TeamListEmpty = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-16 text-center">
    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/8">
      <UsersIcon className="size-6 text-primary/60" />
    </div>
    <div>
      <p className="font-semibold text-foreground">No team members yet</p>
      <p className="mt-0.5 text-sm text-muted-foreground">Invite colleagues to collaborate on fleet and tasks.</p>
    </div>
    <Link className={cn(buttonVariants(), "mt-2")} to="/team/invite">
      Invite team member
    </Link>
  </div>
);
