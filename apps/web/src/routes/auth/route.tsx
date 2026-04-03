import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TruckIcon } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_55%),radial-gradient(ellipse_55%_50%_at_100%_60%,color-mix(in_oklch,var(--accent)_30%,transparent),transparent_50%),radial-gradient(ellipse_45%_40%_at_0%_80%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_45%)]"
      />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-2 ring-primary/20 shadow-[0_4px_24px_0_oklch(0.510_0.180_267/0.16)]">
            <TruckIcon className="size-8" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-tight">Innovate Logistics</h1>
            <p className="text-sm text-muted-foreground">Carrier operations, offline-first</p>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
