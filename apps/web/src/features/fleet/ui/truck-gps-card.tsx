import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { RouteMap } from "@/shared/ui/route-map";

type Props = {
  locationLabel: string;
};

export const TruckGpsCard = ({ locationLabel }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">GPS location</CardTitle>
    </CardHeader>
    <CardContent>
      <RouteMap locations={[locationLabel]} className="min-h-[240px]" />
    </CardContent>
  </Card>
);
