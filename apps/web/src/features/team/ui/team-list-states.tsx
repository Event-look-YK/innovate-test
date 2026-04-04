export const TeamListLoading = () => (
  <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
    Loading team…
  </div>
);

export const TeamListEmpty = () => (
  <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-10 text-center">
    <p className="font-medium text-foreground">No team members yet</p>
    <p className="mt-1 text-sm text-muted-foreground">Invite colleagues to collaborate on fleet and tasks.</p>
  </div>
);
