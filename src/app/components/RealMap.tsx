"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet default icon fix for Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const truckIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  className: "moving-marker",
});

export default function RealMap() {
  const [mounted, setMounted] = useState(false);
  
  const origin: [number, number] = [33.5138, 36.2765]; // Damascus
  const dest: [number, number] = [46.8138, -71.2079]; // Quebec
  
  // Start from origin and move towards destination
  const [current, setCurrent] = useState<[number, number]>(origin);

  useEffect(() => {
    setMounted(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.005;
      if (progress > 1) progress = 0; // loop back
      
      const lat = origin[0] + (dest[0] - origin[0]) * progress;
      const lng = origin[1] + (dest[1] - origin[1]) * progress;
      
      setCurrent([lat, lng]);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div style={{ width: "100%", height: "400px", background: "#f5f7fa", borderRadius: "12px" }} />;
  }

  return (
    <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={[40, -15]} zoom={3} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Full route line */}
        <Polyline positions={[origin, dest]} color="rgba(255, 90, 54, 0.4)" weight={4} dashArray="8, 8" />
        
        {/* Traveled route line */}
        <Polyline positions={[origin, current]} color="var(--primary)" weight={4} />

        <Marker position={origin} icon={customIcon}>
          <Popup><strong>Origin</strong><br/>Damascus, Syria</Popup>
        </Marker>
        
        <Marker position={dest} icon={customIcon}>
          <Popup><strong>Destination</strong><br/>Québec, Canada</Popup>
        </Marker>

        <Marker position={current} icon={truckIcon}>
          <Popup><strong>In Transit</strong><br/>Moving towards destination...</Popup>
        </Marker>
      </MapContainer>
      
      <style>{`
        .moving-marker {
          filter: hue-rotate(140deg);
        }
      `}</style>
    </div>
  );
}
