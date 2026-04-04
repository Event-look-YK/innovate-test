import type { TruckStatus, TruckType } from "@/shared/types/truck";

export const truckTypePresentation: Record<
  string,
  { bg: string; text: string; abbr: string }
> = {
  Truck: { bg: "bg-blue-100", text: "text-blue-700", abbr: "TK" },
  Semi: { bg: "bg-amber-100", text: "text-amber-700", abbr: "SM" },
  Refrigerated: { bg: "bg-cyan-100", text: "text-cyan-700", abbr: "RF" },
  Flatbed: { bg: "bg-orange-100", text: "text-orange-700", abbr: "FB" },
};

export const truckStatusPresentation: Record<TruckStatus, { label: string; dot: string }> = {
  idle: { label: "Idle", dot: "bg-slate-400" },
  on_road: { label: "On road", dot: "bg-emerald-500" },
  maintenance: { label: "Maintenance", dot: "bg-amber-500" },
};

export const getTruckTypePresentation = (type: TruckType | string) =>
  truckTypePresentation[type] ?? {
    bg: "bg-muted",
    text: "text-muted-foreground",
    abbr: type.slice(0, 2).toUpperCase(),
  };
