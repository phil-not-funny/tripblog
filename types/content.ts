export enum BlogPostType {
  TRIP = "trip",
  HIKE = "hike",
}

export enum TripType {
  CITY = "city",
  NATURE = "nature",
  SUMMER = "summer",
  WINTER = "winter",
  PARTY = "party",
}

export type TripFrontmatter = {
  title: string;
  dateFrom: string;
  dateTo: string;
  country: string;
  region?: string;
  type: TripType;
};

export function isTripFrontmatter(obj: any): obj is TripFrontmatter {
  return (
    typeof obj.title === "string" &&
    typeof obj.dateFrom === "string" &&
    typeof obj.dateTo === "string" &&
    typeof obj.country === "string" &&
    (obj.region === undefined || typeof obj.region === "string") &&
    Object.values(TripType).includes(obj.type)
  );
}

export enum HikeType {
  HALF_DAY = "half-day",
  FULL_DAY = "full-day",
  MULTI_DAY = "multi-day",
}

export enum HikeDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  EXPERIENCED = "experienced",
  EXPERT = "expert",
}

export type HikeFrontmatter = {
  destination: string;
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
    Object.values(HikeType).includes(obj.type)
  );
}

export type HikePost = {
  type: BlogPostType.HIKE;
  slug: string;
  html: string;
  frontmatter: HikeFrontmatter;
};

export type TripPost = {
  type: BlogPostType.TRIP;
  slug: string;
  html: string;
  frontmatter: TripFrontmatter;
};

export type BlogPost = HikePost | TripPost;