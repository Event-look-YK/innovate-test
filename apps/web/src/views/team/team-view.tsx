import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";

import { useTeam } from "@/features/team/hooks/use-team";
import { ROLE_LABELS } from "@/shared/constants/roles";
import { ListRowCard } from "@/shared/ui/list-row-link";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const memberStatusConfig: Record<string, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-emerald-500" },
  invited: { label: "Invited", dot: "bg-blue-500" },
  inactive: { label: "Inactive", dot: "bg-slate-400" },
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

const nameColor = (name: string) =>
  avatarColors[
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length
  ] ?? avatarColors[0];

export const TeamView = () => {
  const { data: members, isPending } = useTeam();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">Members and invites</p>
        </div>
        <Link className={cn(buttonVariants(), "w-full shrink-0 sm:w-auto")} to="/team/invite">
          Invite
        </Link>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          Loading team…
        </div>
      ) : members?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-10 text-center">
          <p className="font-medium text-foreground">No team members yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Invite colleagues to collaborate on fleet and tasks.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
          {members?.map((m) => {
            const sc = memberStatusConfig[m.status];
            return (
              <ListRowCard
                key={m.id}
                badges={
                  <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                    {ROLE_LABELS[m.role]}
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
                      nameColor(m.name),
                    )}
                  >
                    {getInitials(m.name)}
                  </div>
                }
                subtitle={m.email}
                title={m.name}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
