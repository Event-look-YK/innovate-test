import { RouteMap } from "@/shared/ui/route-map";
import type { DemandRequest } from "@/features/demand/lib/mock-data";

type Props = {
  row: DemandRequest;
};

export const DemandRouteMap = ({ row }: Props) => {
  const locations = row.routeLabel.split("→").map((s) => s.trim());
  return <RouteMap locations={locations} className="min-h-[280px]" />;
};
