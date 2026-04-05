import "leaflet/dist/leaflet.css";

import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";

import type { RouteMapProps } from "./route-map";

type OsrmRouteResponse = {
  code: string;
  routes?: { geometry: { coordinates: [number, number][] } }[];
};

const fetchDrivingRoute = async (latLngs: [number, number][]): Promise<[number, number][]> => {
  if (latLngs.length < 2) return latLngs;
  const path = latLngs.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("routing failed");
  const data = (await res.json()) as OsrmRouteResponse;
  if (data.code !== "Ok" || !data.routes?.[0]?.geometry.coordinates.length) throw new Error("no route");
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
};

const CITY_COORDS: Record<string, [number, number]> = {
  // Germany
  berlin: [52.52, 13.405],
  munich: [48.1351, 11.582],
  hamburg: [53.5753, 10.0153],
  frankfurt: [50.1109, 8.6821],
  cologne: [50.9333, 6.95],
  stuttgart: [48.7758, 9.1829],
  dortmund: [51.5136, 7.4653],
  düsseldorf: [51.2217, 6.7762],
  nuremberg: [49.4521, 11.0767],
  // France
  paris: [48.8566, 2.3522],
  lyon: [45.764, 4.8357],
  // Benelux
  brussels: [50.8503, 4.3517],
  amsterdam: [52.3676, 4.9041],
  rotterdam: [51.9244, 4.4777],
  // UK
  london: [51.5074, -0.1278],
  // Other major European cities
  madrid: [40.4168, -3.7038],
  rome: [41.9028, 12.4964],
  vienna: [48.2082, 16.3738],
  zurich: [47.3769, 8.5417],
  warsaw: [52.2297, 21.0122],
};

function resolveCoords(label: string): [number, number] | null {
  const key = label.trim().toLowerCase().replace(/[-\s]/g, "_");
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [1, -34],
});

type Point = { label: string; coords: [number, number] };

type FitBoundsProps = {
  points: Point[];
  linePositions: [number, number][];
  isRoadGeometry: boolean;
};

function FitBounds({ points, linePositions, isRoadGeometry }: FitBoundsProps) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || linePositions.length === 0) return;
    const bounds = L.latLngBounds(linePositions);
    mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  }, [linePositions]);

  return (
    <MapContainer
      ref={mapRef}
      className="z-0 size-full rounded-xl"
      center={points[0]?.coords ?? [50.5, 10.0]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ minHeight: "inherit" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker key={p.label} position={p.coords} icon={markerIcon}>
          <Tooltip permanent direction="top" offset={[0, -36]}>
            {p.label}
          </Tooltip>
        </Marker>
      ))}
      {linePositions.length > 1 && (
        <Polyline
          positions={linePositions}
          pathOptions={{
            color: "#3b82f6",
            weight: 3,
            ...(isRoadGeometry ? {} : { dashArray: "8 6" }),
          }}
        />
      )}
    </MapContainer>
  );
}

export default function RouteMapClient({ locations, className }: RouteMapProps) {
  const points = useMemo(
    () =>
      locations
        .map((l) => ({ label: l, coords: resolveCoords(l) }))
        .filter((p): p is Point => p.coords !== null),
    [locations],
  );

  const waypointKey = useMemo(
    () => points.map((p) => `${p.coords[0].toFixed(5)},${p.coords[1].toFixed(5)}`).join("|"),
    [points],
  );

  const straightLine = useMemo(() => points.map((p) => p.coords), [points]);

  const { data: roadLine } = useQuery({
    queryKey: ["osrm-driving-route", waypointKey],
    queryFn: () => fetchDrivingRoute(points.map((p) => p.coords)),
    enabled: points.length >= 2,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  const linePositions = roadLine ?? straightLine;
  const isRoadGeometry = Boolean(roadLine);

  if (points.length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground ${className ?? "min-h-[240px]"}`}>
        No map data available
      </div>
    );
  }

  return (
    <div className={className ?? "min-h-[240px]"}>
      <FitBounds points={points} linePositions={linePositions} isRoadGeometry={isRoadGeometry} />
    </div>
  );
}
