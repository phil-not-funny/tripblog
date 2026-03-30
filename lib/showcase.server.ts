import fs from "fs";
import path from "path";
import { ShowcaseMapLocation } from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

export function getShowcaseMapLocations(): ShowcaseMapLocation[] {
  const dataPath = path.join(contentDir, "showcase-map", "locations.json");
  if (!fs.existsSync(dataPath)) {
    console.warn(`Showcase map locations file not found at ${dataPath}`);
    return [];
  }
  const jsonData = fs.readFileSync(dataPath, "utf8");
  try {
    return JSON.parse(jsonData) as ShowcaseMapLocation[];
  } catch (error) {
    console.error("Error parsing showcase map locations JSON:", error);
    return [];
  }
}
