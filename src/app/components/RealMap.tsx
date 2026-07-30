"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Coordinate lookup table ────────────────────────────────────────────────
const CITY_COORDS: Record<string, [number, number]> = {
  // Middle East
  "damascus, syria": [33.5138, 36.2765],
  "aleppo, syria": [36.2021, 37.1343],
  "beirut, lebanon": [33.8886, 35.4955],
  "amman, jordan": [31.9539, 35.9106],
  "riyadh, saudi arabia": [24.7136, 46.6753],
  "dubai, uae": [25.2048, 55.2708],
  "dubai, united arab emirates": [25.2048, 55.2708],
  "abu dhabi, uae": [24.4539, 54.3773],
  "baghdad, iraq": [33.3152, 44.3661],
  // Europe
  "istanbul, turkey": [41.0082, 28.9784],
  "ankara, turkey": [39.9334, 32.8597],
  "london, uk": [51.5074, -0.1278],
  "london, united kingdom": [51.5074, -0.1278],
  "paris, france": [48.8566, 2.3522],
  "berlin, germany": [52.52, 13.405],
  "madrid, spain": [40.4168, -3.7038],
  "rome, italy": [41.9028, 12.4964],
  "amsterdam, netherlands": [52.3676, 4.9041],
  "vienna, austria": [48.2082, 16.3738],
  "warsaw, poland": [52.2297, 21.0122],
  "athens, greece": [37.9838, 23.7275],
  "moscow, russia": [55.7558, 37.6173],
  "kyiv, ukraine": [50.4501, 30.5234],
  "lisbon, portugal": [38.7169, -9.1399],
  "brussels, belgium": [50.8503, 4.3517],
  "zurich, switzerland": [47.3769, 8.5417],
  "stockholm, sweden": [59.3293, 18.0686],
  "oslo, norway": [59.9139, 10.7522],
  "copenhagen, denmark": [55.6761, 12.5683],
  "helsinki, finland": [60.1699, 24.9384],
  // North America
  "new york, usa": [40.7128, -74.006],
  "new york, united states": [40.7128, -74.006],
  "new york": [40.7128, -74.006],
  "los angeles, usa": [34.0522, -118.2437],
  "los angeles, united states": [34.0522, -118.2437],
  "chicago, usa": [41.8781, -87.6298],
  "houston, usa": [29.7604, -95.3698],
  "miami, usa": [25.7617, -80.1918],
  "toronto, canada": [43.6532, -79.3832],
  "montreal, canada": [45.5017, -73.5673],
  "quebec, canada": [46.8139, -71.2082],
  "vancouver, canada": [49.2827, -123.1207],
  "mexico city, mexico": [19.4326, -99.1332],
  // Africa
  "cairo, egypt": [30.0444, 31.2357],
  "lagos, nigeria": [6.5244, 3.3792],
  "nairobi, kenya": [1.2921, 36.8219],
  "johannesburg, south africa": [26.2041, 28.0473],
  "cape town, south africa": [33.9249, 18.4241],
  "accra, ghana": [5.6037, -0.187],
  "addis ababa, ethiopia": [8.9806, 38.7578],
  "casablanca, morocco": [33.5731, -7.5898],
  "tunis, tunisia": [36.8065, 10.1815],
  "khartoum, sudan": [15.5007, 32.5599],
  // Asia
  "beijing, china": [39.9042, 116.4074],
  "shanghai, china": [31.2304, 121.4737],
  "tokyo, japan": [35.6762, 139.6503],
  "seoul, south korea": [37.5665, 126.978],
  "mumbai, india": [19.076, 72.8777],
  "delhi, india": [28.6139, 77.209],
  "new delhi, india": [28.6139, 77.209],
  "singapore, singapore": [1.3521, 103.8198],
  "hong kong": [22.3193, 114.1694],
  "bangkok, thailand": [13.7563, 100.5018],
  "kuala lumpur, malaysia": [3.139, 101.6869],
  "jakarta, indonesia": [6.2088, 106.8456],
  "karachi, pakistan": [24.8607, 67.0011],
  "lahore, pakistan": [31.5204, 74.3587],
  "dhaka, bangladesh": [23.8103, 90.4125],
  // Oceania
  "sydney, australia": [33.8688, 151.2093],
  "melbourne, australia": [37.8136, 144.9631],
  "brisbane, australia": [27.4698, 153.0251],
  "auckland, new zealand": [36.8485, 174.7633],
  // South America
  "sao paulo, brazil": [23.5505, 46.6333],
  "rio de janeiro, brazil": [22.9068, 43.1729],
  "buenos aires, argentina": [34.6037, 58.3816],
  "bogota, colombia": [4.711, 74.0721],
  "lima, peru": [12.0464, 77.0428],
  "santiago, chile": [33.4489, 70.6693],
};

// Country-level fallback coords (when only country name is given)
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "united states": [38.0, -97.0],
  "usa": [38.0, -97.0],
  "us": [38.0, -97.0],
  "united kingdom": [52.5, -1.5],
  "uk": [52.5, -1.5],
  "france": [46.2, 2.2],
  "germany": [51.2, 10.4],
  "turkey": [39.0, 35.0],
  "canada": [56.0, -96.0],
  "australia": [25.0, 133.0],
  "china": [35.0, 105.0],
  "india": [20.0, 77.0],
  "japan": [36.0, 138.0],
  "brazil": [10.0, 51.0],
  "nigeria": [9.0, 8.0],
  "syria": [35.0, 38.0],
  "egypt": [26.0, 30.0],
  "saudi arabia": [24.0, 45.0],
  "uae": [24.0, 54.0],
  "united arab emirates": [24.0, 54.0],
  "south africa": [29.0, 25.0],
  "kenya": [1.0, 38.0],
  "ghana": [8.0, -1.0],
  "pakistan": [30.0, 70.0],
};

function resolveCoords(locationName: string): [number, number] | null {
  if (!locationName) return null;
  const key = locationName.toLowerCase().trim();

  // 1. Exact match in city table
  if (CITY_COORDS[key]) return CITY_COORDS[key];

  // 2. Partial match — city table entry is a substring of the key (e.g. "new york, united states" contains "new york, usa")
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (key.includes(city)) return coords;
  }

  // 3. Key is a substring of a city table entry (e.g. "new york" matches "new york, united states")
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (city.includes(key)) return coords;
  }

  // 4. Extract first word-group and try matching (handles "New York, NY, USA" → look for "new york")
  const firstPart = key.split(",")[0].trim();
  if (firstPart && firstPart !== key) {
    for (const [city, coords] of Object.entries(CITY_COORDS)) {
      if (city.startsWith(firstPart) || firstPart.includes(city.split(",")[0])) return coords;
    }
  }

  // 5. Country-level fallback
  if (COUNTRY_COORDS[key]) return COUNTRY_COORDS[key];
  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (key.includes(country) || country.includes(key)) return coords;
  }

  return null;
}

// ── Auto-fit bounds ──────────────────────────────────────────────────────────
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (positions.length === 1) {
      map.setView(positions[0], 6);
    }
  }, [map, JSON.stringify(positions)]);
  return null;
}

// ── Props ────────────────────────────────────────────────────────────────────
interface MapStop {
  location: string;
  status: string;
  done?: boolean;
  active?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  timestamp?: number | null;
}

interface RealMapProps {
  origin?: string;
  destination?: string;
  originLatitude?: number | null;
  originLongitude?: number | null;
  destLatitude?: number | null;
  destLongitude?: number | null;
  timeline?: MapStop[];
  currentLocation?: string;
  currentLocationLatitude?: number | null;
  currentLocationLongitude?: number | null;
  isMoving?: boolean;
  movementMode?: "active" | "realtime";
  onReachedNextStop?: () => void;
}

// ── Icons ────────────────────────────────────────────────────────────────────
const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

// ── Component ────────────────────────────────────────────────────────────────
export default function RealMap({
  origin = "",
  destination = "",
  originLatitude = null,
  originLongitude = null,
  destLatitude = null,
  destLongitude = null,
  timeline = [],
  currentLocation = "",
  currentLocationLatitude = null,
  currentLocationLongitude = null,
  isMoving = true,
}: RealMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Resolve origin & destination coords — prefer explicit lat/lon from API
  // Use Number() to guard against backend returning coords as strings
  const originCoords: [number, number] | null =
    originLatitude != null && originLongitude != null
      ? [Number(originLatitude), Number(originLongitude)]
      : resolveCoords(origin);

  const destCoords: [number, number] | null =
    destLatitude != null && destLongitude != null
      ? [Number(destLatitude), Number(destLongitude)]
      : resolveCoords(destination);

  // Resolve current location coords — prefer explicit lat/lon, fall back to name lookup
  const currentCoords: [number, number] | null =
    currentLocationLatitude != null && currentLocationLongitude != null
      ? [Number(currentLocationLatitude), Number(currentLocationLongitude)]
      : resolveCoords(currentLocation);

  // Resolve all timeline stops to get the exact route added by the admin
  const allStops = timeline
    .map(s => ({
      coords: s.latitude != null && s.longitude != null ? [Number(s.latitude), Number(s.longitude)] : resolveCoords(s.location),
      ...s,
    }))
    .filter(s => s.coords !== null) as Array<{ coords: [number, number]; location: string; status: string; done?: boolean; active?: boolean; latitude?: number | null; longitude?: number | null; timestamp?: number | null }>;

  const visitedStops = allStops.filter(s => s.done || s.active);

  const displayCurrentCoords = currentCoords;

  // Build the "traveled" polyline: visited stops -> current
  const traveledPoints: [number, number][] = [];
  for (const stop of visitedStops) {
    const alreadyIn = traveledPoints.some(p => p[0] === stop.coords[0] && p[1] === stop.coords[1]);
    if (!alreadyIn) traveledPoints.push(stop.coords);
  }
  if (displayCurrentCoords) {
    const alreadyIn = traveledPoints.some(p => p[0] === displayCurrentCoords[0] && p[1] === displayCurrentCoords[1]);
    if (!alreadyIn) traveledPoints.push(displayCurrentCoords);
  }

  // Full planned route connects all timeline stops
  const plannedRoute: [number, number][] = [];
  for (const stop of allStops) {
    const alreadyIn = plannedRoute.some(p => p[0] === stop.coords[0] && p[1] === stop.coords[1]);
    if (!alreadyIn) plannedRoute.push(stop.coords);
  }

  // Bounds fitting: fit all timeline routes + current position
  const boundsPoints: [number, number][] = [...plannedRoute];
  if (displayCurrentCoords) {
    const alreadyIn = boundsPoints.some(p => p[0] === displayCurrentCoords[0] && p[1] === displayCurrentCoords[1]);
    if (!alreadyIn) boundsPoints.push(displayCurrentCoords);
  }

  const mapCenter: [number, number] = displayCurrentCoords || originCoords || [20, 0];

  if (!mounted) {
    return (
      <div style={{ width: "100%", height: "400px", background: "#f5f7fa", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
        Loading map…
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
      <MapContainer center={mapCenter} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds positions={boundsPoints} />

        {/* Planned route — full dashed line passing through all added timeline stops */}
        {plannedRoute.length >= 2 && (
          <Polyline positions={plannedRoute} color="rgba(180,180,180,0.6)" weight={3} dashArray="8, 8" />
        )}

        {/* Traveled route — solid orange line for visited stops */}
        {traveledPoints.length >= 2 && (
          <Polyline positions={traveledPoints} color="#FF5A36" weight={4} />
        )}

        {/* Render all timeline route markers (static dots) EXCEPT the one that is currently active (which gets the bouncing dot) */}
        {allStops
          .filter(s => {
            // Do not draw a generic timeline marker if this is exactly the current location,
            // to avoid rendering two dots perfectly on top of each other.
            if (displayCurrentCoords && s.coords[0] === displayCurrentCoords[0] && s.coords[1] === displayCurrentCoords[1]) {
              return false;
            }
            return true;
          })
          .map((stop, i) => {
            const isFinal = stop === allStops[allStops.length - 1];
            let color = "#aaaaaa"; // pending
            if (isFinal) {
              color = "#5e5ce6"; // blue for final destination
            } else if (stop.done) {
              color = "#34c759"; // green for done
            } else if (stop.active) {
              color = "#FF5A36"; // orange for active
            }

            return (
              <Marker key={i} position={stop.coords} icon={pinIcon(color)}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  {stop.location}
                </Tooltip>
                <Popup>
                  <strong>{isFinal ? "🏁" : (stop.done ? "✓" : (stop.active ? "📍" : "⏳"))} {stop.status}</strong><br />{stop.location}
                </Popup>
              </Marker>
            );
          })}

        {/* Current position marker — bouncing if moving, static if stationary */}
        {displayCurrentCoords && (
          <Marker
            position={displayCurrentCoords}
            icon={L.divIcon({
              className: "",
              html: `<div class="${isMoving ? "map-dot-moving" : "map-dot-static"}"></div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            })}
          >
            <Tooltip direction="top" offset={[0, -15]} opacity={1}>
              {currentLocation || "Current Location"}
            </Tooltip>
            <Popup>
              <strong>{isMoving ? "🚛 In Transit" : "⏸ Stationary"}</strong>
              <br />{currentLocation || "Current Location"}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <style>{`
        .map-dot-moving {
          width: 22px; height: 22px;
          background: #FF5A36;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,90,54,0.3);
          animation: mapBounce 0.7s ease-in-out infinite alternate;
        }
        .map-dot-static {
          width: 22px; height: 22px;
          background: #FF5A36;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,90,54,0.3);
        }
        @keyframes mapBounce {
          from { transform: translateY(0)   scale(1);    box-shadow: 0 0 0 4px rgba(255,90,54,0.3); }
          to   { transform: translateY(-8px) scale(1.1); box-shadow: 0 8px 16px rgba(255,90,54,0.2); }
        }
      `}</style>
    </div>
  );
}
