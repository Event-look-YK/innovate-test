import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

export const TruckGpsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">GPS trail</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground">
        Last 24h path (Mapbox placeholder)
      </div>
    </CardContent>
  </Card>
);
