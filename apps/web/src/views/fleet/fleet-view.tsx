import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { TruckFormDialog } from "@/features/fleet/ui/truck-form-dialog";
import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { Button, buttonVariants } from "@innovate-test/ui/components/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innovate-test/ui/components/table";
import type { TruckStatus, TruckType } from "@/shared/types/truck";

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
        <Button type="button" onClick={() => setDialogOpen(true)}>
          Add truck
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <Input
          className="max-w-xs"
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or tracker…"
          value={q}
        />
        <Select onValueChange={(v) => setTypeFilter(v as TruckType | "all")} value={typeFilter}>
          <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-[180px]">
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

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-end pr-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell className="pl-5 text-muted-foreground" colSpan={6}>
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => {
                const tc = typeConfig[t.type];
                const sc = statusConfig[t.status];
                return (
                  <TableRow key={t.id}>
                    <TableCell className="pl-5 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                            tc?.bg ?? "bg-muted",
                            tc?.text ?? "text-muted-foreground",
                          )}
                        >
                          {tc?.abbr ?? t.type.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{t.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.type}</TableCell>
                    <TableCell className="text-sm">{t.payloadT} t</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            sc?.dot ?? "bg-muted-foreground",
                          )}
                        />
                        <span className="text-sm">{sc?.label ?? t.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.locationLabel}
                    </TableCell>
                    <TableCell className="pr-5 text-end">
                      <Link
                        className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                        params={{ truckId: t.id }}
                        to="/fleet/$truckId"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <TruckFormDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </div>
  );
};
