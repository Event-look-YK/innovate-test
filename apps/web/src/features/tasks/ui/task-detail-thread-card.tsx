import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

export const TaskDetailThreadCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Thread</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Linked messages (offline-capable) — mock
    </CardContent>
  </Card>
);
