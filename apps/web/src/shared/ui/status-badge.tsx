import { Badge } from "@innovate-test/ui/components/badge";

import type { TaskStatus } from "@/shared/constants/task-status";

type Props = {
  status: TaskStatus | string;
};

export const StatusBadge = ({ status }: Props) => (
  <Badge variant="secondary" className="font-normal">
    {status}
  </Badge>
);
