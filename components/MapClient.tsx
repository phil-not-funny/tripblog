"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SimpleMap({
  lat,
  lng,
  zoom = 12,
  height = "350px",
  children,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: "100%", height }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}
