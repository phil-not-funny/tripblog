import { BlogPost, BlogPostType } from "@/types/content";

export async function blogTypeToPlural(
  post: BlogPostType
): Promise<"trips" | "hikes"> {
  return post === BlogPostType.TRIP ? "trips" : "hikes";
}

export async function slugToUrl(post: BlogPost): Promise<string> {
  return `/${post.locale}/${await blogTypeToPlural(post.type)}/${post.slug}`;
}

export async function sSlugToUrl(
  slug: string,
  type: BlogPostType,
  locale: string
): Promise<string> {
  return `/${locale}/${await blogTypeToPlural(type)}/${slug}`;
}
