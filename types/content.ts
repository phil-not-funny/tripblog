import { Locale } from "./internationalization";

export enum BlogPostType {
  TRIP = "trip",
  HIKE = "hike",
}

export type FrontmatterBase = {
  title: string;
  shortDescription?: string;
  introLat?: number;
  introLng?: number;
  relatedLinks?: string[];
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
      typeof obj.shortDescription === "string")
  );
}

export enum TripType {
  CITY = "city",
  NATURE = "nature",
  BEACH = "beach",
  WINTER = "winter",
  PARTY = "party",
}

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

export enum HikeType {
  CIRCULAR = "circular",
  LINEAR = "linear",
}

export enum HikeDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERIENCED = "experienced",
  EXPERT = "expert",
}

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
  type: BlogPostType.HIKE;
  frontmatter: HikeFrontmatter;
} & PostBase;

export type TripPost = {
  type: BlogPostType.TRIP;
  frontmatter: TripFrontmatter;
} & PostBase;

export type BlogPost = HikePost | TripPost;
