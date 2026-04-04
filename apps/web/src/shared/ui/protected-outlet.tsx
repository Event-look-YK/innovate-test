import { Link, Outlet } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { type Role } from "@/shared/constants/roles";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

type Props = {
  allow: readonly Role[];
};

export const ProtectedOutlet = ({ allow }: Props) => {
  const { user, isPending } = useCurrentUser();

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Checking access...</p>;
  }

  if (!user?.role || !allow.includes(user.role)) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-5">
        <p className="font-semibold">Access denied</p>
        <p className="text-sm text-muted-foreground">
          Your current account role does not have permission for this section.
        </p>
        <Link className={cn(buttonVariants({ size: "sm" }), "w-fit")} to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return <Outlet />;
};
