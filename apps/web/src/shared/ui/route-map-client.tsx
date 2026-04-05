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
  kyiv: [50.4501, 30.5234],
  lviv: [49.8397, 24.0297],
  odesa: [46.4825, 30.7233],
  uman: [48.7494, 30.2214],
  zhytomyr: [50.2547, 28.6587],
  kharkiv: [49.9935, 36.2304],
  dnipro: [48.4647, 35.0462],
  zaporizhzhia: [47.8388, 35.1396],
  vinnytsia: [49.2331, 28.4682],
  poltava: [49.5883, 34.5514],
  chernihiv: [51.4982, 31.2893],
  cherkasy: [49.4444, 32.0598],
  sumy: [50.9077, 34.7981],
  rivne: [50.6199, 26.2516],
  ternopil: [49.5535, 25.5948],
  lutsk: [50.7472, 25.3254],
  ivano_frankivsk: [48.9226, 24.7111],
  uzhhorod: [48.6208, 22.2879],
  mykolaiv: [46.975, 31.9946],
  kropyvnytskyi: [48.5079, 32.2623],
};

const UKRAINIAN_TO_CITY_KEY: Record<string, keyof typeof CITY_COORDS> = {
  київ: "kyiv",
  львів: "lviv",
  одеса: "odesa",
  умань: "uman",
  житомир: "zhytomyr",
  харків: "kharkiv",
  дніпро: "dnipro",
  запоріжжя: "zaporizhzhia",
  вінниця: "vinnytsia",
  полтава: "poltava",
  чернігів: "chernihiv",
  черкаси: "cherkasy",
  суми: "sumy",
  рівне: "rivne",
  тернопіль: "ternopil",
  луцьк: "lutsk",
  івано_франківськ: "ivano_frankivsk",
  ужгород: "uzhhorod",
  миколаїв: "mykolaiv",
  кропивницький: "kropyvnytskyi",
};

function resolveCoords(label: string): [number, number] | null {
  const key = label.trim().toLowerCase().replace(/[-\s]/g, "_");
  const fromUk = UKRAINIAN_TO_CITY_KEY[key];
  if (fromUk) return CITY_COORDS[fromUk];
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
      center={points[0]?.coords ?? [49.0, 31.0]}
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
