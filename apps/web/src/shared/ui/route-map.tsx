import { lazy, Suspense } from "react";

const RouteMapLazy = lazy(() => import("./route-map-client"));

export type RouteMapProps = {
  locations: string[];
  className?: string;
};

export const RouteMap = (props: RouteMapProps) => {
  if (typeof window === "undefined") return null;

  return (
    <Suspense
      fallback={
        <div className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground ${props.className ?? "min-h-[240px]"}`}>
          Loading map…
        </div>
      }
    >
      <RouteMapLazy {...props} />
    </Suspense>
  );
};
