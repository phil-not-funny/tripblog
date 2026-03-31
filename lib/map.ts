import { MapMarkerToolTip } from "@/components/Map/MapClient";
import { isShowcaseMapRegion, ShowcaseMapLocation } from "@/types/content";
import { Locale } from "@/types/internationalization";
import L from "leaflet";
import { divIcon } from "leaflet";

import { renderToStaticMarkup } from "react-dom/server";

/**
 * Gets a colored Marker
 */
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

/**
 * Execute from client.
 */
export function addMarker(
  location: ShowcaseMapLocation,
  locale: Locale,
  layer: L.LayerGroup,
  regioned: boolean = false,
  regionExtra?: string,
) {
  const marker = L.marker([location.lat, location.lng], {
    icon: coloredMarker(
      regioned || isShowcaseMapRegion(location)
        ? "#D11B82"
        : (location.color ??
            (location.important
              ? "#ef4444"
              : location.nature
                ? "#10B981"
                : "#3b82f6")),
    ),
  });
  marker.bindTooltip(
    renderToStaticMarkup(MapMarkerToolTip({ location, locale, regionExtra })),
  );
  layer.addLayer(marker);
  return marker;
}
