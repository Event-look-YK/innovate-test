import { Link } from "@tanstack/react-router";
import { Button } from "@innovate-test/ui/components/button";
import { UserPlusIcon } from "lucide-react";

import { useTeam } from "@/features/team/hooks/use-team";
import { TeamListEmpty, TeamListLoading } from "@/features/team/ui/team-list-states";
import { TeamMemberCard } from "@/features/team/ui/team-member-card";

export const TeamView = () => {
  const { data: members, isPending } = useTeam();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">Members and invites</p>
        </div>
        <Button
          className="w-full shrink-0 sm:w-auto"
          icon={<UserPlusIcon />}
          nativeButton={false}
          render={<Link to="/team/invite" />}
        >
          Invite
        </Button>
      </div>

      {isPending ? (
        <TeamListLoading />
      ) : members?.length === 0 ? (
        <TeamListEmpty />
      ) : (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
          {members?.map((m) => (
            <TeamMemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
};
