import { Link } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";

import { useRoutes } from "@/features/routes/hooks/use-routes";
import { SparklesIcon } from "lucide-react";
import { RoutePlanRow } from "@/features/routes/ui/route-plan-row";
import { RoutesListEmpty, RoutesListLoading } from "@/features/routes/ui/routes-list-states";

export const RoutesView = () => {
  const { data: routes, isPending } = useRoutes();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Routes</h1>
          <p className="text-sm text-muted-foreground">Generated delivery plans</p>
        </div>
        <Button
          className="w-full shrink-0 sm:w-auto"
          icon={<SparklesIcon />}
          nativeButton={false}
          render={<Link to="/routes/generate" />}
        >
          Generate route
        </Button>
      </div>

      {isPending ? (
        <RoutesListLoading />
      ) : routes?.length === 0 ? (
        <RoutesListEmpty />
      ) : (
        <div className="flex flex-col gap-2">
          {routes?.map((r) => (
            <RoutePlanRow key={r.id} route={r} />
          ))}
        </div>
      )}
    </div>
  );
};
