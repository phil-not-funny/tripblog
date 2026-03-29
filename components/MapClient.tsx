"use client";

import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
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

import { divIcon } from "leaflet";
import { Locale } from "@/types/internationalization";
import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function coloredMarker(color: string) {
  return divIcon({
    className: "",
    html: `<div style="
      width: 16px;
      height: 16px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

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
  const t = useTranslations();
  const [tilesLoaded, setTilesLoaded] = useState(false);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden z-10 ${outerClassName}`}
    >
      {!tilesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <span>{t("components.map.loading")}...</span>
        </div>
      )}
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: "100%", height }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            load: () => setTilesLoaded(true),
          }}
        />
        {children}
      </MapContainer>
    </div>
  );
}

export function ShowcaseMap({
  locations,
  locale,
}: {
  locations: ShowcaseMapLocation[];
  locale: Locale;
}) {
  const t = useTranslations();

  return (
    <Fragment>
      <SimpleMap lat={47.8002} lng={13.0435} zoom={4} height="500px">
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            title={location[locale].name}
            alt={location[locale].name}
            icon={
              location.color
                ? coloredMarker(location.color)
                : location.important
                  ? coloredMarker("#E33B17")
                  : coloredMarker("#1B99D1")
            }
          >
            <Tooltip>
              <b>{location[locale].name}</b>, {location[locale].nameExtension}
              {location.timesVisited ? (
                <b>{` (x${location.timesVisited})`}</b>
              ) : (
                ""
              )}
              <br />
              <i>{location[locale].extra}</i>
            </Tooltip>
          </Marker>
        ))}
      </SimpleMap>
      <div className="space-2 flex flex-col md:flex-row items-center md:w-full md:justify-around">
        <div className="flex flex-row items-center">
          <div
            dangerouslySetInnerHTML={{
              __html: coloredMarker("#1BD16A").createIcon().getHTML(),
            }}
            className="mr-4"
          />
          {t("showcase.hometownMarker")}
        </div>
        <div className="flex flex-row items-center">
          <div
            dangerouslySetInnerHTML={{
              __html: coloredMarker("#E33B17").createIcon().getHTML(),
            }}
            className="mr-4"
          />
          {t("showcase.importantMarker")}
        </div>
        <div className="flex flex-row items-center">
          <div
            dangerouslySetInnerHTML={{
              __html: coloredMarker("#1B99D1").createIcon().getHTML(),
            }}
            className="mr-4"
          />
          {t("showcase.otherMarker")}
        </div>
      </div>
    </Fragment>
  );
}
