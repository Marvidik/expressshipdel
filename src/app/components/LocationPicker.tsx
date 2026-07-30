"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationValue {
    location: string;
    latitude: number | null;
    longitude: number | null;
}

interface LocationPickerProps {
    value?: LocationValue;
    onChange: (value: LocationValue) => void;
    label?: string;
    placeholder?: string;
}

function MapCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center[0], center[1], zoom, map]);

    return null;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            { headers: { Accept: "application/json", "Accept-Language": "en" } }
        );
        const data = await res.json();
        return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    } catch {
        return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    }
}

function MapClickHandler({
    onMapClick,
}: {
    onMapClick: (lat: number, lon: number) => void;
}) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LocationPicker({
    value,
    onChange,
    label = "Location",
    placeholder = "Search location...",
}: LocationPickerProps) {
    const [searchText, setSearchText] = useState(value?.location || "");
    const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync from parent only when not actively typing
    useEffect(() => {
        if (!isFocused) {
            setSearchText(value?.location || "");
        }
    }, [value?.location, isFocused]);

    useEffect(() => {
        const term = searchText.trim();
        if (term.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeout = window.setTimeout(async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(term)}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "Accept-Language": "en",
                        },
                    }
                );
                const data = await response.json();
                setSuggestions(data || []);
            } catch {
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchText]);

    const selectedCoords = useMemo<[number, number] | null>(() => {
        if (value?.latitude != null && value?.longitude != null) {
            return [value.latitude, value.longitude];
        }
        return null;
    }, [value?.latitude, value?.longitude]);

    const center: [number, number] = selectedCoords || [20, 0];

    // Commit whatever is typed when the user leaves the field (blur) or presses Enter
    const handleSearchCommit = () => {
        setSuggestions([]);
        const trimmed = searchText.trim();
        if (!trimmed) return;
        // If name changed from the stored value, clear coords (they belong to the old name)
        const coordsStillValid = trimmed === (value?.location || "").trim();
        onChange({
            location: trimmed,
            latitude: coordsStillValid ? (value?.latitude ?? null) : null,
            longitude: coordsStillValid ? (value?.longitude ?? null) : null,
        });
    };

    const handleSelectSuggestion = (suggestion: { display_name: string; lat: string; lon: string }) => {
        const nextValue: LocationValue = {
            location: suggestion.display_name,
            latitude: parseFloat(suggestion.lat),
            longitude: parseFloat(suggestion.lon),
        };
        setSearchText(nextValue.location);
        setSuggestions([]);
        onChange(nextValue);
    };

    const handleMapClick = async (lat: number, lon: number) => {
        const name = await reverseGeocode(lat, lon);
        const nextValue: LocationValue = {
            location: name,
            latitude: lat,
            longitude: lon,
        };
        setSearchText(name);
        setSuggestions([]);
        onChange(nextValue);
    };

    const handleMarkerDragEnd = async (event: L.DragEndEvent) => {
        const marker = event.target;
        const latlng = marker.getLatLng();
        const name = await reverseGeocode(latlng.lat, latlng.lng);
        const nextValue: LocationValue = {
            location: name,
            latitude: latlng.lat,
            longitude: latlng.lng,
        };
        setSearchText(name);
        onChange(nextValue);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155" }}>{label}</label>
            <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => { setIsFocused(false); handleSearchCommit(); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearchCommit(); } }}
                placeholder={placeholder}
                style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "8px", border: "1px solid #dbe4f0" }}
            />

            {isLoading && searchText.trim().length >= 2 && (
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Searching…</p>
            )}

            {suggestions.length > 0 && (
                <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", background: "#fff", overflow: "hidden", boxShadow: "0 8px 20px rgba(15,23,42,0.06)" }}>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.display_name}-${index}`}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                            }}
                            style={{ width: "100%", textAlign: "left", padding: "0.7rem 0.9rem", border: "none", background: "#fff", cursor: "pointer", borderBottom: index === suggestions.length - 1 ? "none" : "1px solid #f1f5f9" }}
                        >
                            <div style={{ fontSize: "0.9rem", color: "#0f172a" }}>{suggestion.display_name}</div>
                        </button>
                    ))}
                </div>
            )}

            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", minHeight: "280px" }}>
                {!mounted ? (
                    <div style={{ height: "280px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                        Loading map…
                    </div>
                ) : (
                    <MapContainer center={center} zoom={selectedCoords ? 6 : 2} style={{ height: "280px", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapCenter center={center} zoom={selectedCoords ? 6 : 2} />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {selectedCoords && (
                            <Marker
                                position={selectedCoords}
                                draggable
                                eventHandlers={{ dragend: handleMarkerDragEnd }}
                                icon={L.divIcon({
                                    className: "",
                                    html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>`,
                                    iconSize: [16, 16],
                                    iconAnchor: [8, 8],
                                })}
                            >
                                <Popup>{value?.location || "Selected location"}</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                )}
            </div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
                💡 Click on the map or drag the marker to select an exact location — the name updates automatically.
            </p>
        </div>
    );
}
