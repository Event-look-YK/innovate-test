import { ZapIcon } from "lucide-react";

export const DemandListLoading = () => (
  <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
    Loading demand…
  </div>
);

export const DemandListEmpty = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center">
    <ZapIcon className="mb-3 size-10 text-muted-foreground/45" />
    <p className="font-medium text-foreground">No open requests</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      When you need extra capacity, new demand will show up here.
    </p>
  </div>
);
