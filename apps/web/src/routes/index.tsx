import { buttonVariants } from "@innovate-test/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-8 py-5 border-b">
        <span className="text-xl font-bold tracking-tight">Innovate Logistics</span>
        <div className="flex gap-3">
          <Link to="/auth/sign-in" className={buttonVariants({ variant: "ghost" })}>Sign in</Link>
          <Link to="/auth/sign-up" className={buttonVariants()}>Get started</Link>
        </div>
      </header>
      <section className="flex flex-col items-center text-center px-6 py-28 max-w-3xl mx-auto gap-6">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
          Smarter freight.<br />Faster deliveries.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Innovate Logistics connects carriers and shippers on a single platform —
          streamlining demand, fleet, routes, and tasks so your operation runs without friction.
        </p>
        <div className="flex gap-4 mt-2">
          <Link to="/auth/sign-up" className={buttonVariants({ size: "lg" })}>Start for free</Link>
          <Link to="/auth/sign-in" className={buttonVariants({ size: "lg", variant: "outline" })}>Sign in</Link>
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-8 py-16">
        {[
          {
            title: "Demand management",
            description:
              "Create and track freight requests in real time. Match loads with available capacity instantly.",
          },
          {
            title: "Fleet tracking",
            description:
              "Monitor your entire fleet from one dashboard. Assign trucks, drivers, and routes with ease.",
          },
          {
            title: "Route optimisation",
            description:
              "Generate efficient routes automatically and reduce fuel costs across your network.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border p-6 flex flex-col gap-3">
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.description}</p>
          </div>
        ))}
      </section>
      <footer className="border-t px-8 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Innovate Logistics. All rights reserved.
      </footer>
    </div>
  );
}
