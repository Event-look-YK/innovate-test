import { Outlet, createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% -10%, oklch(0.540 0.200 267 / 0.15) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 95% 60%, oklch(0.540 0.200 267 / 0.10) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 5% 80%, oklch(0.580 0.180 285 / 0.08) 0%, transparent 45%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.540 0.200 267 / 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          mask: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8">
        <Link to="/" className="flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
            <img src="/favicon.svg" alt="Innovate Logistics" className="size-16" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-tight">Innovate Logistics</h1>
            <p className="text-sm text-muted-foreground">Carrier operations platform</p>
          </div>
        </Link>

        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
