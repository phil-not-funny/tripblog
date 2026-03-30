import {
  isShowcaseMapRegion,
  ShowcaseMapLocation,
  ShowcaseMapSpot,
} from "@/types/content";

export function flattenShowcaseMapLocations(
  locations: ShowcaseMapLocation[],
): ShowcaseMapSpot[] {
  return locations.flatMap((location) => {
    if (isShowcaseMapRegion(location)) {
      return location.items;
    } else {
      return location;
    }
  });
}
