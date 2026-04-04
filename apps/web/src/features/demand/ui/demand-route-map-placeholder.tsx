import { RouteMap } from "@/shared/ui/route-map";
import type { DemandRequestDetail } from "@/shared/types/demand";

type Props = {
  row: DemandRequestDetail;
};

export const DemandRouteMap = ({ row }: Props) => {
  const locations = [row.originLabel, row.destinationLabel];
  return <RouteMap locations={locations} className="min-h-[280px]" />;
};
