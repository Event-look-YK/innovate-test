import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { TaskTimeline } from "@/features/tasks/ui/task-timeline";

export const TaskDetailTimelineCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Status timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <TaskTimeline />
    </CardContent>
  </Card>
);
