import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { FleetFilters } from "@/features/fleet/ui/fleet-filters";
import { FleetListEmpty, FleetListLoading } from "@/features/fleet/ui/fleet-list-states";
import { FleetTruckRow } from "@/features/fleet/ui/fleet-truck-row";
import { useFleet } from "@/features/fleet/hooks/use-fleet";
import { buttonVariants } from "@innovate-test/ui/components/button";
import { cn } from "@innovate-test/ui/lib/utils";
import type { TruckStatus, TruckType } from "@/shared/types/truck";

export const FleetView = () => {
  const { data: trucks, isPending } = useFleet();
  const [typeFilter, setTypeFilter] = useState<TruckType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TruckStatus | "all">("all");
  const [q, setQ] = useState("");
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
        <Link className={cn(buttonVariants(), "w-full shrink-0 sm:w-auto")} to="/fleet/new">
          Add truck
        </Link>
      </div>

      <FleetFilters
        onQChange={setQ}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        q={q}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />

      {isPending ? (
        <FleetListLoading />
      ) : filtered.length === 0 ? (
        <FleetListEmpty />
      ) : (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-3">
          {filtered.map((t) => (
            <FleetTruckRow key={t.id} truck={t} />
          ))}
        </div>
      )}
    </div>
  );
};
