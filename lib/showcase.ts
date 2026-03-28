import { ShowcaseMapLocation } from "@/types/content";
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export async function getShowcaseMapLocations(): Promise<
  ShowcaseMapLocation[]
> {
  const dataPath = path.join(contentDir, "showcase-map", "locations.json");
  if (!fs.existsSync(dataPath)) {
    console.warn(`Showcase map locations file not found at ${dataPath}`);
    return [];
  }
  const jsonData = fs.readFileSync(dataPath, "utf8");
  try {
    const locations: ShowcaseMapLocation[] = JSON.parse(jsonData);
    return locations;
  } catch (error) {
    console.error("Error parsing showcase map locations JSON:", error);
    return [];
  }
}
