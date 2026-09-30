// components/dashboard/HexMap.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  type MapMouseEvent,
} from "react-map-gl/mapbox";
import type { FillLayerSpecification, LineLayerSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAP_CENTER, type Hotspot } from "@/lib/mockData";
import { hotspotsToHexGeoJSON } from "@/lib/hexagon";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SEVERITY_COLOR: Record<Hotspot["severity"], string> = {
  critical: "#FB5B4C",
  high: "#F5A524",
  medium: "#22D3EE",
  low: "#34D399",
};

interface HexMapProps {
  hotspots: Hotspot[];
  selectedId: string | null;
  onSelect: (hotspot: Hotspot) => void;
}

const fillLayer: FillLayerSpecification = {
  id: "hotspots-fill",
  type: "fill",
  source: "hotspots",
  paint: {
    "fill-color": [
      "match",
      ["get", "severity"],
      "critical",
      SEVERITY_COLOR.critical,
      "high",
      SEVERITY_COLOR.high,
      "medium",
      SEVERITY_COLOR.medium,
      SEVERITY_COLOR.low,
    ],
    "fill-opacity": [
      "case",
      ["==", ["get", "id"], ["literal", ""]],
      0.85,
      0.45,
    ],
  },
};

const outlineLayer: LineLayerSpecification = {
  id: "hotspots-outline",
  type: "line",
  source: "hotspots",
  paint: {
    "line-color": [
      "match",
      ["get", "severity"],
      "critical",
      SEVERITY_COLOR.critical,
      "high",
      SEVERITY_COLOR.high,
      "medium",
      SEVERITY_COLOR.medium,
      SEVERITY_COLOR.low,
    ],
    "line-width": 1.5,
    "line-opacity": 0.9,
  },
};

export default function HexMap({ hotspots, selectedId, onSelect }: HexMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const geojson = useMemo(() => hotspotsToHexGeoJSON(hotspots), [hotspots]);

  const fillLayerStyle = useMemo<FillLayerSpecification>(
    () => ({
      ...fillLayer,
      paint: {
        ...fillLayer.paint,
        "fill-opacity": [
          "case",
          ["==", ["get", "id"], ["literal", selectedId ?? ""]],
          0.85,
          ["==", ["get", "id"], ["literal", hoveredId ?? ""]],
          0.65,
          0.35,
        ],
      },
    }),
    [selectedId, hoveredId]
  );

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const id = feature.properties?.id as string | undefined;
      const hotspot = hotspots.find((h) => h.id === id);
      if (hotspot) onSelect(hotspot);
    },
    [hotspots, onSelect]
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0B0F14]">
        <div className="max-w-sm rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-5 text-center">
          <p className="text-sm font-medium text-amber-300">
            Mapbox token missing
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
            Set{" "}
            <code className="rounded bg-white/[0.08] px-1 py-0.5 font-mono text-[12px] text-slate-300">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>{" "}
            in your environment to render the live hex-grid map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: MAP_CENTER[0],
          latitude: MAP_CENTER[1],
          zoom: 10.4,
          pitch: 35,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactiveLayerIds={["hotspots-fill"]}
        onClick={handleClick}
        onMouseMove={(e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          setHoveredId(id ?? null);
        }}
        onMouseLeave={() => setHoveredId(null)}
        cursor={hoveredId ? "pointer" : "grab"}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source id="hotspots" type="geojson" data={geojson}>
          <Layer {...fillLayerStyle} />
          <Layer {...outlineLayer} />
        </Source>

        {/* Pulsing glow markers for critical / high severity cells */}
        {hotspots
          .filter((h) => h.severity === "critical" || h.severity === "high")
          .map((h) => (
            <Marker key={h.id} longitude={h.lng} latitude={h.lat}>
              <span className="relative flex h-3 w-3">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: SEVERITY_COLOR[h.severity] }}
                />
                <span
                  className="relative inline-flex h-3 w-3 rounded-full ring-2 ring-[#0B0F14]"
                  style={{ backgroundColor: SEVERITY_COLOR[h.severity] }}
                />
              </span>
            </Marker>
          ))}
      </Map>

      {/* Signature element: rotating radar sweep, ops-console framing */}
      <div className="pointer-events-none absolute bottom-5 left-5 h-24 w-24 opacity-40">
        <div className="h-full w-full animate-[spin_4s_linear_infinite] rounded-full border border-cyan-400/20">
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(34,211,238,0.35), transparent 30%)",
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-1 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute left-5 top-5 flex flex-col gap-1.5 rounded-lg border border-white/[0.08] bg-[#0B0F14]/85 px-3.5 py-3 backdrop-blur">
        <span className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Demand Severity
        </span>
        {(
          [
            ["critical", "Critical"],
            ["high", "High"],
            ["medium", "Medium"],
            ["low", "Low"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: SEVERITY_COLOR[key] }}
            />
            <span className="text-[11px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}