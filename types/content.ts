/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale } from "./internationalization";

export const BlogPostType = {
  TRIP: "trip",
  HIKE: "hike",
} as const;
export type BlogPostType = (typeof BlogPostType)[keyof typeof BlogPostType];

export type FrontmatterBase = {
  title: string;
  shortDescription?: string;
  introLat?: number;
  introLng?: number;
  internalWeight?: number;
  disableToc?: boolean;
};

export function isFrontmatterBase(obj: any): obj is FrontmatterBase {
  return (
    typeof obj.title === "string" &&
    (obj.introLat === undefined || typeof obj.introLat === "number") &&
    (obj.introLng === undefined || typeof obj.introLng === "number") &&
    (obj.relatedLinks === undefined ||
      (Array.isArray(obj.relatedLinks) &&
        obj.relatedLinks.every((link: any) => typeof link === "string"))) &&
    (obj.shortDescription === undefined ||
      typeof obj.shortDescription === "string") &&
    (obj.internalWeight === undefined ||
      typeof obj.internalWeight === "number") &&
    (obj.disableToc === undefined || typeof obj.disableToc === "boolean")
  );
}

export const TripType = {
  CITY: "city",
  NATURE: "nature",
  BEACH: "beach",
  WINTER: "winter",
  PARTY: "party",
} as const;
export type TripType = (typeof TripType)[keyof typeof TripType];

export type TripFrontmatter = FrontmatterBase & {
  dateFrom: string;
  dateTo?: string;
  country: string;
  region?: string;
  name: string;
  type: TripType;
};

export function isTripFrontmatter(obj: any): obj is TripFrontmatter {
  return (
    typeof obj.dateFrom === "string" &&
    (obj.dateTo === undefined || typeof obj.dateTo === "string") &&
    typeof obj.country === "string" &&
    (obj.region === undefined || typeof obj.region === "string") &&
    typeof obj.name === "string" &&
    Object.values(TripType).includes(obj.type) &&
    isFrontmatterBase(obj)
  );
}

export const HikeType = {
  CIRCULAR: "circular",
  LINEAR: "linear",
} as const;
export type HikeType = (typeof HikeType)[keyof typeof HikeType];

export const HikeDifficulty = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  EXPERIENCED: "experienced",
  EXPERT: "expert",
} as const;
export type HikeDifficulty =
  (typeof HikeDifficulty)[keyof typeof HikeDifficulty];

export const HikeSeason = {
  SPRING: "spring",
  SUMMER: "summer",
  AUTUMN: "autumn",
  WINTER: "winter",
} as const;
export type HikeSeason = (typeof HikeSeason)[keyof typeof HikeSeason];

export type HikeFrontmatter = FrontmatterBase & {
  destination: string;
  lastDone?: string;
  massive?: string;
  from: string;
  viaUp?: string;
  viaReturn?: string;
  path: string;
  fromHM: number;
  toHM: number;
  totalHM: number;
  walkingMinutes: number;
  totalMinutes?: number;
  difficulty: HikeDifficulty;
  type: HikeType;
  season?: HikeSeason;
};

export function isHikeFrontmatter(obj: any): obj is HikeFrontmatter {
  return (
    typeof obj.destination === "string" &&
    (obj.massive === undefined || typeof obj.massive === "string") &&
    typeof obj.from === "string" &&
    (obj.viaUp === undefined || typeof obj.viaUp === "string") &&
    (obj.viaReturn === undefined || typeof obj.viaReturn === "string") &&
    typeof obj.path === "string" &&
    typeof obj.fromHM === "number" &&
    typeof obj.toHM === "number" &&
    typeof obj.totalHM === "number" &&
    typeof obj.walkingMinutes === "number" &&
    (obj.totalMinutes === undefined || typeof obj.totalMinutes === "number") &&
    Object.values(HikeDifficulty).includes(obj.difficulty) &&
    Object.values(HikeType).includes(obj.type) &&
    (obj.lastDone === undefined || typeof obj.lastDone === "string") &&
    isFrontmatterBase(obj)
  );
}

export type PostBase = {
  slug: string;
  html: string;
  locale: Locale;
};

export type HikePost = {
  type: "hike";
  frontmatter: HikeFrontmatter;
} & PostBase;

export type TripPost = {
  type: "trip";
  frontmatter: TripFrontmatter;
} & PostBase;

export type BlogPost = HikePost | TripPost;

export function isTripPosts(blogs: BlogPost[]): blogs is TripPost[] {
  return blogs.every((blog) => blog.type === BlogPostType.TRIP);
}
export function isHikePosts(blogs: BlogPost[]): blogs is HikePost[] {
  return blogs.every((blog) => blog.type === BlogPostType.HIKE);
}

export type ShowcaseMapLocation = ShowcaseMapRegion | ShowcaseMapSpot;

export type ShowcaseMapRegion = {
  lat: number;
  lng: number;
  items: ShowcaseMapLocation[];
} & {
  [K in Locale]: {
    name: string;
    nameExtension?: string;
  };
};

export type ShowcaseMapSpot = {
  lat: number;
  lng: number;
  important?: boolean;
  timesVisited?: number;
  color?: string;
} & {
  [K in Locale]: {
    name: string;
    nameExtension?: string;
    extra?: string;
  };
};

export function isShowcaseMapRegion(
  location: ShowcaseMapLocation,
): location is ShowcaseMapRegion {
  return "items" in location && Array.isArray(location.items);
}

export function isShowcaseMapSpot(
  location: ShowcaseMapLocation,
): location is ShowcaseMapSpot {
  return !("items" in location);
}
