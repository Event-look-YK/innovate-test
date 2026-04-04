type LoadingProps = { message?: string };

export const FleetListLoading = ({ message = "Loading fleet…" }: LoadingProps) => (
  <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
    {message}
  </div>
);

export const FleetListEmpty = () => (
  <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-10 text-center">
    <p className="font-medium text-foreground">No trucks match your filters</p>
    <p className="mt-1 text-sm text-muted-foreground">Try clearing search or pick “All” in the filters.</p>
  </div>
);
