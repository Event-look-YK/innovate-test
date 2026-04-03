import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@innovate-test/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";
import {
  ClipboardListIcon,
  MapPinIcon,
  PackageIcon,
  PlusIcon,
  RouteIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

import { useTasks } from "@/features/tasks/hooks/use-tasks";

const kpis = [
  {
    label: "Active tasks",
    value: "24",
    icon: ClipboardListIcon,
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-100",
  },
  {
    label: "Trucks on road",
    value: "18 / 32",
    icon: TruckIcon,
    color: "text-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
  },
  {
    label: "Pending demand",
    value: "5",
    icon: PackageIcon,
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-100",
  },
  {
    label: "Route efficiency",
    value: "87%",
    icon: TrendingUpIcon,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
];

const statusDot: Record<string, string> = {
  Pending: "bg-amber-400",
  "In progress": "bg-blue-500",
  Completed: "bg-emerald-500",
  Delivered: "bg-emerald-600",
  Cancelled: "bg-red-400",
};

const priorityStyles: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
};

export const AdminManagerDashboardView = () => {
  const { data: tasks } = useTasks();
  const recent = tasks?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operations overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {k.label}
                  </p>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">{k.value}</p>
                </div>
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                    k.bg,
                    k.ring,
                  )}
                >
                  <k.icon className={cn("size-5", k.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map + recent tasks */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Fleet map placeholder */}
        <Card className="min-h-[260px] overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <MapPinIcon className="size-4 text-primary" />
              Fleet map
            </CardTitle>
            <CardDescription>Live truck positions (Mapbox placeholder)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-100 via-blue-50/60 to-slate-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,--theme(--color-blue-100/60%),transparent_55%),radial-gradient(circle_at_70%_35%,--theme(--color-indigo-100/40%),transparent_45%)]" />
              <div className="absolute left-[28%] top-[40%] size-3 rounded-full bg-primary/70 shadow-[0_0_0_4px_oklch(0.510_0.180_267/0.15)]" />
              <div className="absolute left-[55%] top-[55%] size-2.5 rounded-full bg-primary/50 shadow-[0_0_0_3px_oklch(0.510_0.180_267/0.12)]" />
              <div className="absolute left-[72%] top-[30%] size-2.5 rounded-full bg-amber-500/60 shadow-[0_0_0_3px_var(--color-amber-100)]" />
              <div className="relative flex flex-col items-center gap-1 text-center">
                <MapPinIcon className="size-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/50">Map preview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent tasks</CardTitle>
            <CardDescription>Status · priority · corridor</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="pl-6 font-medium">{t.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            statusDot[t.status] ?? "bg-muted-foreground",
                          )}
                        />
                        <span className="text-xs">{t.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
                          priorityStyles[t.priority] ?? "bg-muted text-muted-foreground",
                        )}
                      >
                        {t.priority}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link className={cn(buttonVariants())} to="/tasks/new">
          <PlusIcon data-icon="inline-start" />
          New task
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline" }))} to="/routes/generate">
          <RouteIcon data-icon="inline-start" />
          Generate routes
        </Link>
        <Link className={cn(buttonVariants({ variant: "outline" }))} to="/team/invite">
          <UsersIcon data-icon="inline-start" />
          Invite team
        </Link>
      </div>
    </div>
  );
};
