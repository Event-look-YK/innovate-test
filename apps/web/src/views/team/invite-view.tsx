import { TeamInviteForm } from "@/features/team/ui/team-invite-form";

export const InviteView = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Invite teammate</h1>
      <p className="text-muted-foreground">Email and role</p>
    </div>
    <TeamInviteForm />
  </div>
);
