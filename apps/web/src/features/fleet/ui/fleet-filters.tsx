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

const typeFilterLabels: Record<TruckType | "all", string> = {
  all: "All types",
  Truck: "Truck",
  Semi: "Semi",
  Refrigerated: "Refrigerated",
  Flatbed: "Flatbed",
};

const statusFilterLabels: Record<TruckStatus | "all", string> = {
  all: "All statuses",
  idle: "Idle",
  on_road: "On road",
  maintenance: "Maintenance",
};

type Props = {
  q: string;
  onQChange: (value: string) => void;
  typeFilter: TruckType | "all";
  onTypeFilterChange: (value: TruckType | "all") => void;
  statusFilter: TruckStatus | "all";
  onStatusFilterChange: (value: TruckStatus | "all") => void;
};

export const FleetFilters = ({
  q,
  onQChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: Props) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
    <Input
      className="w-full sm:max-w-xs"
      onChange={(e) => onQChange(e.target.value)}
      placeholder="Search name or tracker…"
      value={q}
    />
    <Select onValueChange={(v) => onTypeFilterChange(v as TruckType | "all")} value={typeFilter}>
      <SelectTrigger className="w-full sm:w-[min(100%,11.25rem)]">
        <SelectValue placeholder="Type">
          {(value: string | null) => (value ? typeFilterLabels[value as TruckType | "all"] ?? value : null)}
        </SelectValue>
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
      onValueChange={(v) => onStatusFilterChange(v as TruckStatus | "all")}
      value={statusFilter}
    >
      <SelectTrigger className="w-full sm:w-[min(100%,11.25rem)]">
        <SelectValue placeholder="Status">
          {(value: string | null) =>
            value ? statusFilterLabels[value as TruckStatus | "all"] ?? value : null}
        </SelectValue>
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
);
