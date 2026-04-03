import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";

import { useTeam } from "@/features/team/hooks/use-team";
import { ROLE_LABELS } from "@/shared/constants/roles";

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
        <Link className={cn(buttonVariants())} to="/team/invite">
          Invite
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5">Invited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell className="pl-5 text-muted-foreground" colSpan={5}>
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              members?.map((m) => {
                const sc = memberStatusConfig[m.status];
                return (
                  <TableRow key={m.id}>
                    <TableCell className="pl-5 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            nameColor(m.name),
                          )}
                        >
                          {getInitials(m.name)}
                        </div>
                        <span>{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-foreground/70">
                        {ROLE_LABELS[m.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            sc?.dot ?? "bg-muted-foreground",
                          )}
                        />
                        <span className="text-sm">{sc?.label ?? m.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-sm text-muted-foreground">
                      {m.invitedAt}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
