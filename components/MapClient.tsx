"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ShowcaseMapLocation } from "@/types/content";

// Fix Leaflet's broken default icon paths in bundled environments
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon as unknown as string,
  iconRetinaUrl: markerIcon2x as unknown as string,
  shadowUrl: markerShadow as unknown as string,
});

export default function SimpleMap({
  lat,
  lng,
  zoom = 12,
  height = "350px",
  children,
  outerClassName = "",
}: {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  children?: React.ReactNode;
  outerClassName?: string;
}) {
  return (
    <div
      className={`w-full rounded-2xl overflow-hidden z-10 ${outerClassName}`}
    >
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

export function ShowcaseMap({
  locations,
}: {
  locations: ShowcaseMapLocation[];
}) {
  return (
    <SimpleMap lat={47.8002} lng={13.0435} zoom={5} height="500px">
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lng]}
          title={location.name}
          alt={location.name}
        >
          <Tooltip>
            <b>{location.name}</b>, {location.nameExtension} <br />
            {location.extra}
          </Tooltip>
        </Marker>
      ))}
    </SimpleMap>
  );
}
