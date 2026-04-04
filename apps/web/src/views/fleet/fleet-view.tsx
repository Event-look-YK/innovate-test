import { useState } from "react";

import { TruckFormDialog } from "@/features/fleet/ui/truck-form-dialog";
import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { Button } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import { Input } from "@innovate-test/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innovate-test/ui/components/select";
import type { TruckStatus, TruckType } from "@/shared/types/truck";
import { ListRowLink } from "@/shared/ui/list-row-link";

const typeConfig: Record<string, { bg: string; text: string; abbr: string }> = {
  Truck: { bg: "bg-blue-100", text: "text-blue-700", abbr: "TK" },
  Semi: { bg: "bg-amber-100", text: "text-amber-700", abbr: "SM" },
  Refrigerated: { bg: "bg-cyan-100", text: "text-cyan-700", abbr: "RF" },
  Flatbed: { bg: "bg-orange-100", text: "text-orange-700", abbr: "FB" },
};

const statusConfig: Record<TruckStatus, { label: string; dot: string }> = {
  idle: { label: "Idle", dot: "bg-slate-400" },
  on_road: { label: "On road", dot: "bg-emerald-500" },
  maintenance: { label: "Maintenance", dot: "bg-amber-500" },
};

export const FleetView = () => {
  const { data: trucks, isPending } = useFleet();
  const [typeFilter, setTypeFilter] = useState<TruckType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TruckStatus | "all">("all");
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered =
    trucks?.filter((t) => {
      const okType = typeFilter === "all" || t.type === typeFilter;
      const okStatus = statusFilter === "all" || t.status === statusFilter;
      const okQ =
        q.trim() === "" ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.trackerId.includes(q);
      return okType && okStatus && okQ;
    }) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Fleet</h1>
          <p className="text-sm text-muted-foreground">Trucks and trailers</p>
        </div>
        <Button className="w-full shrink-0 sm:w-auto" type="button" onClick={() => setDialogOpen(true)}>
          Add truck
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          className="w-full sm:max-w-xs"
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or tracker…"
          value={q}
        />
        <Select onValueChange={(v) => setTypeFilter(v as TruckType | "all")} value={typeFilter}>
          <SelectTrigger className="w-full sm:w-[min(100%,11.25rem)]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Semi">Semi</SelectItem>
              <SelectItem value="Refrigerated">Refrigerated</SelectItem>
              <SelectItem value="Flatbed">Flatbed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) => setStatusFilter(v as TruckStatus | "all")}
          value={statusFilter}
        >
          <SelectTrigger className="w-full sm:w-[min(100%,11.25rem)]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="on_road">On road</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="rounded-xl border border-border/60 bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
          Loading fleet…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-10 text-center">
          <p className="font-medium text-foreground">No trucks match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try clearing search or pick “All” in the filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
          {filtered.map((t) => {
            const tc = typeConfig[t.type];
            const sc = statusConfig[t.status];
            return (
              <ListRowLink
                key={t.id}
                badges={
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-2 py-0.5 text-[10px] font-semibold text-foreground/85 ring-1 ring-border/50">
                    <span className={cn("size-1.5 shrink-0 rounded-full", sc?.dot)} />
                    {sc?.label ?? t.status}
                  </span>
                }
                footer={
                  <>
                    <span>{t.type}</span>
                    <span className="tabular-nums">{t.payloadT} t payload</span>
                    <span className="min-w-0 truncate">{t.locationLabel}</span>
                  </>
                }
                leading={
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl text-xs font-bold",
                      tc?.bg ?? "bg-muted",
                      tc?.text ?? "text-muted-foreground",
                    )}
                  >
                    {tc?.abbr ?? t.type.slice(0, 2).toUpperCase()}
                  </div>
                }
                routeParams={{ truckId: t.id }}
                subtitle={`Tracker ${t.trackerId}`}
                title={t.name}
                to="/fleet/$truckId"
              />
            );
          })}
        </div>
      )}
      <TruckFormDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </div>
  );
};
