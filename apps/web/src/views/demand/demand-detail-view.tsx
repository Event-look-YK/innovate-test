import { Link, useParams } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useDemandDetail } from "@/features/demand/hooks/use-demand";
import { DemandDetailSummaryCard } from "@/features/demand/ui/demand-detail-summary-card";
import { DemandFreelancersCard } from "@/features/demand/ui/demand-freelancers-card";
import { DemandRouteMap } from "@/features/demand/ui/demand-route-map-placeholder";

export const DemandDetailView = () => {
  const { requestId } = useParams({ strict: false }) as { requestId: string };
  const { data: row, isPending } = useDemandDetail(requestId);

  if (isPending) {
    return <p className="text-muted-foreground">Loading request...</p>;
  }

  if (!row) {
    return <p className="text-muted-foreground">Request not found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link className={cn("self-start", buttonVariants({ size: "sm", variant: "ghost" }))} to="/demand">
        ← Demand
      </Link>
      <DemandDetailSummaryCard row={row} />
      <DemandRouteMap row={row} />
      <DemandFreelancersCard requestId={row.id} />
    </div>
  );
};
