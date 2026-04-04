import { Button } from "@innovate-test/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@innovate-test/ui/components/select";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTeam } from "@/features/team/hooks/use-team";
import { ROLES } from "@/shared/constants/roles";
import type { Task } from "@/shared/types/task";

type Props = {
  task: Task;
};

export const TaskDetailAssignmentCard = ({ task }: Props) => {
  const { data: members } = useTeam();
  const drivers = members?.filter(
    (m) => m.status === "active" && (m.role === ROLES.CARRIER_DRIVER || m.role === ROLES.CARRIER_MANAGER),
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);

  const assignedMember = members?.find((m) => m.id === selectedMemberId);

  const handleAssign = () => {
    if (!selectedMemberId) return;
    toast.success(`Assigned to ${assignedMember?.name ?? selectedMemberId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assignment</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground">
          {task.assignedTruckId ? `Truck ${task.assignedTruckId}` : "No truck assigned"}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Assign team member</p>
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedMemberId(value ?? undefined)} value={selectedMemberId}>
              <SelectTrigger className="flex-1">
                {assignedMember ? (
                  <span className="flex items-center gap-2 text-sm">
                    <UserIcon className="size-3.5 text-muted-foreground" />
                    {assignedMember.name}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Select a member…</span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {drivers?.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button disabled={!selectedMemberId} type="button" onClick={handleAssign}>
              Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
