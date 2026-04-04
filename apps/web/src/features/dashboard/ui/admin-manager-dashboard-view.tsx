import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import {
  PackageIcon,
  PlusIcon,
  RouteIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

const statusColor: Record<string, string> = {
  Pending: "bg-amber-400",
  "In progress": "bg-blue-500",
  Completed: "bg-emerald-500",
  Delivered: "bg-emerald-600",
  Cancelled: "bg-red-400",
};

const statusText: Record<string, string> = {
  Pending: "text-amber-600",
  "In progress": "text-blue-600",
  Completed: "text-emerald-600",
  Delivered: "text-emerald-700",
  Cancelled: "text-red-500",
};

const priorityText: Record<string, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-slate-400",
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export const AdminManagerDashboardView = () => {
  const { data: tasks } = useTasks();
  const { user } = useCurrentUser();
  const recent = tasks?.slice(0, 4) ?? [];
  const firstName = user?.name?.split(" ")[0] ?? "team";

  return (
    <div className="flex flex-col gap-5">

      {/* ── Greeting banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-5 text-primary-foreground">
        {/* Dot-grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
              {todayLabel}
            </p>
            <h1 className="mt-1 text-2xl font-bold">
              {getGreeting()}, {firstName}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />
              18 trucks active
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold opacity-75">
              <PackageIcon className="size-3" />
              5 pending requests
            </div>
          </div>
        </div>
      </div>

      {/* ── Three metrics ── */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Fleet utilization — dominant card */}
        <Card className="overflow-hidden">
          <CardContent className="pb-5 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Fleet utilization
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-[56px] font-black leading-none tabular-nums tracking-tighter">
                18
              </span>
              <span className="mb-2 text-xl font-light text-muted-foreground">/ 32</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Trucks currently on road</p>

            {/* Visual truck-status grid */}
            <div className="mt-4 flex flex-wrap gap-1">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "size-2.5 rounded-[3px]",
                    i < 2 ? "bg-amber-400" : i < 18 ? "bg-primary/70" : "bg-border",
                  )}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-[2px] bg-primary/70" />
                On road
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-[2px] bg-amber-400" />
                Maintenance
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-[2px] bg-border" />
                Idle
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active tasks */}
        <Card className="overflow-hidden">
          <CardContent className="pb-5 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Active tasks
            </p>
            <span className="mt-3 block text-[56px] font-black leading-none tabular-nums tracking-tighter">
              24
            </span>
            <p className="mt-0.5 text-xs text-muted-foreground">Across all corridors</p>

            {/* Stacked breakdown bar */}
            <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[33%] bg-red-400" />
              <div className="h-full w-[50%] bg-blue-400" />
              <div className="h-full w-[17%] bg-amber-400" />
            </div>
            <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
              <span>
                <span className="font-bold text-red-500">8</span> urgent
              </span>
              <span>
                <span className="font-bold text-blue-500">12</span> active
              </span>
              <span>
                <span className="font-bold text-amber-500">4</span> pending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Route efficiency */}
        <Card className="overflow-hidden">
          <CardContent className="pb-5 pt-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Route efficiency
            </p>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-[56px] font-black leading-none tabular-nums tracking-tighter">
                87
              </span>
              <span className="mb-2 text-2xl font-light text-muted-foreground">%</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">vs 85% last week</p>

            {/* Trend bar */}
            <div className="mt-4 flex items-end gap-0.5">
              {[62, 70, 68, 74, 80, 83, 87].map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    i === 6 ? "bg-primary/80" : "bg-primary/20",
                  )}
                  style={{ height: `${(v / 90) * 36}px` }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <TrendingUpIcon className="size-3.5 text-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-600">+2.4% week-on-week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Activity timeline + side panel ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_268px]">

        {/* Activity timeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-0.5 rounded-full bg-primary" />
              <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex flex-col">
              {recent.map((t, i) => (
                <div key={t.id} className="flex gap-4">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center pt-[5px]">
                    <div
                      className={cn(
                        "size-2 shrink-0 rounded-full ring-2 ring-background",
                        statusColor[t.status] ?? "bg-muted-foreground",
                      )}
                    />
                    {i < recent.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-border/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      "min-w-0 flex-1",
                      i < recent.length - 1 ? "pb-5" : "pb-0",
                    )}
                  >
                    <p className="truncate text-sm font-semibold leading-snug">{t.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {t.originLabel} → {t.destinationLabel}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[10px] font-semibold",
                          statusText[t.status] ?? "text-muted-foreground",
                        )}
                      >
                        {t.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40">·</span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          priorityText[t.priority] ?? "text-muted-foreground",
                        )}
                      >
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-3">

          {/* Demand alert */}
          <Card className="overflow-hidden border-l-[3px] border-l-amber-400">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                  <PackageIcon className="size-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">5 demand requests</p>
                  <p className="text-xs text-muted-foreground">Awaiting freelancer match</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardContent className="flex flex-col gap-0.5 pb-3 pt-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Quick actions
              </p>
              {[
                { to: "/tasks/new", icon: PlusIcon, label: "New task" },
                { to: "/routes/generate", icon: RouteIcon, label: "Generate routes" },
                { to: "/team/invite", icon: UsersIcon, label: "Invite team" },
                { to: "/fleet", icon: TruckIcon, label: "View fleet" },
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 justify-start gap-3 rounded-lg px-3 text-sm",
                  )}
                  to={to}
                >
                  <Icon className="size-4 text-primary/70" />
                  {label}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
