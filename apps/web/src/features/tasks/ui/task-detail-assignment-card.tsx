import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
};

export const TaskDetailAssignmentCard = ({ task }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Assignment</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      {task.assignedTruckId ? `Truck ${task.assignedTruckId}` : "Unassigned"}
    </CardContent>
  </Card>
);
