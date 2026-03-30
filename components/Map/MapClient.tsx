"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  isShowcaseMapRegion,
  ShowcaseMapLocation,
  ShowcaseMapSpot,
} from "@/types/content";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Locale } from "@/types/internationalization";
import { Fragment } from "react/jsx-runtime";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { coloredMarker, addMarker } from "@/lib/map";

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
  grouped = false,
  regioned = false,
}: {
  locations: ShowcaseMapLocation[];
  locale: Locale;
  grouped?: boolean;
  regioned?: boolean;
}) {
  const t = useTranslations();

  const markers = [
    {
      color: "#1BD16A",
      id: "hometownMarker",
    },
    {
      color: "#E33B17",
      id: "importantMarker",
    },
    {
      color: "#1B99D1",
      id: "otherMarker",
    },
    {
      color: "#D11B82",
      id: "regionMarker",
    },
  ];

  const MarkerLegend = ({ marker }: { marker: (typeof markers)[number] }) => {
    return (
      <div className="flex flex-row items-center">
        <div
          dangerouslySetInnerHTML={{
            __html: coloredMarker(marker.color).createIcon().getHTML(),
          }}
          className="mr-4"
        />
        {t(`showcase.${marker.id}`)}
      </div>
    );
  };

  return (
    <Fragment>
      <SimpleMap lat={47.8002} lng={13.0435} zoom={4} height="500px">
        {grouped ? (
          <ClusteredMarkers locations={locations} locale={locale} />
        ) : regioned ? (
          <RegionMarkers locations={locations} locale={locale} />
        ) : (
          (locations as ShowcaseMapSpot[]).map((location, index) => (
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
                <MapMarkerToolTip location={location} locale={locale} />
              </Tooltip>
            </Marker>
          ))
        )}
      </SimpleMap>
      <div className="space-2 flex flex-col md:flex-row items-center md:w-full md:justify-around">
        {markers.map((marker) => (
          <MarkerLegend key={marker.id} marker={marker} />
        ))}
      </div>
    </Fragment>
  );
}

export function MapMarkerToolTip({
  location,
  locale,
  regionExtra,
}: {
  location: ShowcaseMapLocation;
  locale: Locale;
  regionExtra?: string;
}) {
  return (
    <>
      <b>{location[locale].name}</b>, {location[locale].nameExtension}
      {isShowcaseMapRegion(location) ? (
        <b>{` (${location.items.length})`}</b>
      ) : location.timesVisited ? (
        <b>{` (x${location.timesVisited})`}</b>
      ) : (
        ""
      )}
      <br />
      <i>
        {isShowcaseMapRegion(location) ? regionExtra : location[locale].extra}
      </i>
    </>
  );
}

export function ClusteredMarkers({
  locations,
  locale,
}: {
  locations: ShowcaseMapLocation[];
  locale: Locale;
}) {
  const map = useMap();

  useEffect(() => {
    const cluster = L.markerClusterGroup();

    locations.forEach((location) => {
      addMarker(location, locale, cluster);
    });

    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
    };
  }, [map, locations, locale]);

  return null;
}

export function RegionMarkers({
  locations,
  locale,
  regionZoomThreshold = 4,
}: {
  locations: ShowcaseMapLocation[];
  locale: Locale;
  regionZoomThreshold?: number;
}) {
  const map = useMap();
  const t = useTranslations();

  useEffect(() => {
    const regionLayer = L.layerGroup();
    const detailLayer = L.layerGroup();

    locations.forEach((location) => {
      if (isShowcaseMapRegion(location)) {
        // this is a region — show parent marker at low zoom
        const marker = addMarker(
          location,
          locale,
          regionLayer,
          true,
          t("components.map.toolTipRegionExtra"),
        );
        marker.addEventListener("click", () => {
          map.setView(marker.getLatLng(), regionZoomThreshold + 1);
        });
        // show children at high zoom
        location.items.forEach((child) =>
          addMarker(child, locale, detailLayer),
        );
      } else {
        // plain location — show at all zoom levels via detail layer
        addMarker(location, locale, detailLayer);
        addMarker(location, locale, regionLayer);
      }
    });

    const update = () => {
      const zoom = map.getZoom();
      if (zoom <= regionZoomThreshold) {
        map.addLayer(regionLayer);
        map.removeLayer(detailLayer);
      } else {
        map.removeLayer(regionLayer);
        map.addLayer(detailLayer);
      }
    };

    update();
    map.on("zoomend", update);

    return () => {
      map.off("zoomend", update);
      map.removeLayer(regionLayer);
      map.removeLayer(detailLayer);
    };
  }, [map, locations, locale, regionZoomThreshold]);

  return null;
}
