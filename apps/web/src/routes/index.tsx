import { buttonVariants } from "@innovate-test/ui/components/button";
import { ShimmerButton } from "@innovate-test/ui/components/shimmer-button";
import { AnimatedGradientText } from "@innovate-test/ui/components/animated-gradient-text";
import { cn } from "@innovate-test/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BoxIcon,
  CheckCircle2Icon,
  MapPinIcon,
  RouteIcon,
  SparklesIcon,
  TruckIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const STATS = [
  { value: "2,400+", label: "Carriers onboarded" },
  { value: "18,000+", label: "Trucks tracked" },
  { value: "98.2%", label: "On-time delivery" },
  { value: "340K", label: "Routes optimised" },
];

const FEATURES = [
  {
    icon: BoxIcon,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Demand management",
    description:
      "Create and track freight requests in real time. Match loads with available capacity instantly and eliminate manual coordination.",
  },
  {
    icon: TruckIcon,
    color: "text-sky-600",
    bg: "bg-sky-50",
    title: "Fleet tracking",
    description:
      "Monitor your entire fleet from one dashboard. Assign trucks, drivers, and routes with ease — from dispatch to delivery.",
  },
  {
    icon: RouteIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Route optimisation",
    description:
      "AI-powered route generation cuts fuel costs and delivery times. Get the best path across your entire network, automatically.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Post a demand request",
    description:
      "Shippers enter their freight details. The platform instantly computes weight, volume, and matching criteria.",
    icon: BoxIcon,
  },
  {
    number: "02",
    title: "Match with carriers",
    description:
      "Carriers and freelance drivers receive automatic match notifications. Accept, negotiate, and confirm in seconds.",
    icon: UsersIcon,
  },
  {
    number: "03",
    title: "Track every delivery",
    description:
      "Real-time GPS tracking, automated status updates, and a full audit trail from pickup to proof of delivery.",
    icon: MapPinIcon,
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">

      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <TruckIcon className="size-4 text-primary" />
          </div>
          <span className="text-base font-bold tracking-tight">Innovate Logistics</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth/sign-in" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Sign in
          </Link>
          <Link to="/auth/sign-up">
            <ShimmerButton
              shimmerColor="rgba(255,255,255,0.7)"
              shimmerDuration="2.5s"
              background="oklch(0.540 0.200 267)"
              borderRadius="0.625rem"
              className="h-9 px-4 text-sm font-semibold"
            >
              Get started
            </ShimmerButton>
          </Link>
        </div>
      </header>

      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-24 pt-20 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.540 0.200 267 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.540 0.200 267 / 0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.540 0.200 267 / 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, oklch(0.540 0.200 267 / 0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6">
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <SparklesIcon className="size-3" />
            New · AI route generation is live
            <ArrowRightIcon className="size-3 opacity-70" />
          </div>

          <h1 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Smarter freight.{" "}
            <br className="hidden sm:block" />
            <AnimatedGradientText
              colorFrom="oklch(0.540 0.200 267)"
              colorTo="oklch(0.580 0.200 300)"
              speed={0.4}
            >
              Faster deliveries.
            </AnimatedGradientText>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Innovate Logistics connects carriers and shippers on a single platform —
            streamlining demand, fleet, routes, and tasks so your operation runs without friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/auth/sign-up">
              <ShimmerButton
                shimmerColor="rgba(255,255,255,0.8)"
                shimmerDuration="2.5s"
                background="oklch(0.540 0.200 267)"
                borderRadius="0.625rem"
                className="h-12 px-7 text-base font-semibold"
              >
                Start for free
              </ShimmerButton>
            </Link>
            <Link
              to="/auth/sign-in"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 font-bold gap-2")}
            >
              Sign in <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm text-muted-foreground">
            {["No credit card required", "Setup in 5 minutes", "Free tier available"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5 px-6 py-8">
              <span className="text-3xl font-black tracking-tight text-foreground">{s.value}</span>
              <span className="text-center text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
              <ZapIcon className="size-3" />
              Platform features
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Everything in one place
            </h2>
            <p className="max-w-xl text-muted-foreground">
              From posting a demand to confirming delivery — every workflow your logistics team
              needs is built in, connected, and real-time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
              >
                <div className={cn("flex size-12 items-center justify-center rounded-xl", f.bg)}>
                  <f.icon className={cn("size-5", f.color)} />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-snug">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
                <div className="mt-auto pt-2">
                  <Link
                    to="/auth/sign-up"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Get started
                    <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
              <RouteIcon className="size-3" />
              Simple process
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              How it works
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Get your first shipment coordinated in under 10 minutes. No onboarding call required.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="relative flex flex-col gap-4">
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute top-6 left-16 hidden h-px w-full bg-linear-to-r from-border to-transparent md:block"
                  />
                )}
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/8 font-black text-sm text-primary">
                    {step.number}
                  </div>
                  <div className="h-px flex-1 bg-border md:hidden" />
                </div>
                <div>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-background shadow-sm border border-border">
                    <step.icon className="size-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 120% at 50% 100%, oklch(0.540 0.200 267 / 0.12) 0%, transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl flex flex-col items-center gap-6">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ready to move smarter?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of carriers and shippers already running their operations on Innovate
            Logistics.
          </p>
          <Link to="/auth/sign-up">
            <ShimmerButton
              shimmerColor="rgba(255,255,255,0.8)"
              shimmerDuration="2.5s"
              background="oklch(0.540 0.200 267)"
              borderRadius="0.625rem"
              className="h-12 px-8 text-base font-bold"
            >
              Start for free — no credit card
            </ShimmerButton>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <TruckIcon className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold">Innovate Logistics</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <Link to="/auth/sign-in" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Innovate Logistics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
