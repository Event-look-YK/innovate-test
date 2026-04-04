import { cn } from "@innovate-test/ui/lib/utils";

import {
  memberInitials,
  memberNameToAvatarClass,
  memberRoleLabel,
  memberStatusPresentation,
} from "@/features/team/lib/utils";
import type { TeamMember } from "@/features/team/lib/mock-data";
import { ListRowCard } from "@/shared/ui/list-row-link";

type Props = {
  member: TeamMember;
};

export const TeamMemberCard = ({ member: m }: Props) => {
  const sc = memberStatusPresentation[m.status];
  return (
    <ListRowCard
      badges={
        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
          {memberRoleLabel(m.role)}
        </span>
      }
      footer={
        <>
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("size-1.5 shrink-0 rounded-full", sc?.dot)} />
            {sc?.label ?? m.status}
          </span>
          <span>Invited {m.invitedAt}</span>
        </>
      }
      leading={
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-full text-xs font-bold",
            memberNameToAvatarClass(m.name),
          )}
        >
          {memberInitials(m.name)}
        </div>
      }
      subtitle={m.email}
      title={m.name}
    />
  );
};
