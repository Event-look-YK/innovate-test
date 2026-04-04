import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";

import { formatWeightT } from "@/shared/lib/format";
import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
};

export const TaskDetailCargoCard = ({ task }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Cargo</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2 text-sm">
      <p>{task.cargoDescription}</p>
      <p className="text-muted-foreground">
        {task.cargoType} · {formatWeightT(task.weightT)}
      </p>
    </CardContent>
  </Card>
);
