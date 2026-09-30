// lib/hexagon.ts
// Generates flat-top hexagon polygons around a lat/lng center to visually
// simulate an H3 grid cell without pulling in the h3-js dependency for the
// hackathon MVP. Swap `hotspotsToHexGeoJSON` for a real H3 cell boundary
// lookup (h3.cellToBoundary) once request ingestion is indexed to H3.

import type { Feature, FeatureCollection, Polygon } from "geojson";
import type { Hotspot } from "./mockData";

const KM_PER_DEG_LAT = 110.574;

function kmPerDegLng(lat: number): number {
  return 111.32 * Math.cos((lat * Math.PI) / 180);
}

/**
 * Returns a closed ring of [lng, lat] pairs approximating a regular hexagon
 * of the given radius (in km) centered on [lng, lat].
 */
export function createHexagonRing(
  center: [number, number],
  radiusKm = 0.55
): number[][] {
  const [lng, lat] = center;
  const degLat = KM_PER_DEG_LAT;
  const degLng = kmPerDegLng(lat);

  const ring: number[][] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30; // flat-top orientation
    const angleRad = (Math.PI / 180) * angleDeg;
    const dx = (radiusKm * Math.cos(angleRad)) / degLng;
    const dy = (radiusKm * Math.sin(angleRad)) / degLat;
    ring.push([lng + dx, lat + dy]);
  }
  ring.push(ring[0]);
  return ring;
}

export interface HexProperties {
  id: string;
  severity: Hotspot["severity"];
  requestCount: number;
  category: string;
  name: string;
}

/**
 * Converts the mock hotspot list into a FeatureCollection of hexagon
 * polygons, sized loosely by request volume, ready to feed into a
 * react-map-gl <Source type="geojson">.
 */
export function hotspotsToHexGeoJSON(
  hotspots: Hotspot[]
): FeatureCollection<Polygon, HexProperties> {
  const maxCount = Math.max(...hotspots.map((h) => h.requestCount));

  const features: Feature<Polygon, HexProperties>[] = hotspots.map((h) => {
    const scale = 0.45 + (h.requestCount / maxCount) * 0.55; // 0.45–1.0
    const radiusKm = 0.42 * scale;
    const ring = createHexagonRing([h.lng, h.lat], radiusKm);

    return {
      type: "Feature",
      properties: {
        id: h.id,
        severity: h.severity,
        requestCount: h.requestCount,
        category: h.category,
        name: h.name,
      },
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
    };
  });

  return { type: "FeatureCollection", features };
}
