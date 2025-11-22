import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import {
  type BlogPost,
  BlogPostType,
  HikeFrontmatter,
  isHikeFrontmatter,
  isTripFrontmatter,
  TripFrontmatter,
} from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

export function getPostSlugs(type: BlogPostType): string[] {
  const dir = path.join(contentDir, type);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  console.log("🔎 Entries in dir", entries);

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(".md"));
}

export function asHumanReadable(slugs: string[]): string[] {
  return slugs.map((slug) => asSingleHumanReadable(slug));
}

export function asSingleHumanReadable(slug: string): string {
  return (
    slug.charAt(0).toUpperCase() +
    slug.slice(1).replace(/-/g, " ").replace(/\.md$/, "")
  );
}

export async function getPostBySlug(
  type: BlogPostType,
  slug: string
): Promise<BlogPost> {
  console.log("ℹ️ slug", slug);
  console.log("ℹ️ type", type);

  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(contentDir, type, slug);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  if (!(isHikeFrontmatter(data) || isTripFrontmatter(data))) {
    throw new Error(`Invalid frontmatter in post: ${slug}`);
  }

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  if (type === BlogPostType.TRIP) {
    return {
      type: BlogPostType.TRIP,
      slug: realSlug,
      frontmatter: data as TripFrontmatter,
      html: contentHtml,
    };
  } else {
    return {
      type: BlogPostType.HIKE,
      slug: realSlug,
      frontmatter: data as HikeFrontmatter,
      html: contentHtml,
    };
  }
}

export async function getAllPosts(type: BlogPostType): Promise<BlogPost[]> {
  const slugs = getPostSlugs(type);
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(type, s)));
  console.log("❓ posts", posts);
  return posts.sort((a, b) => {
    if (
      type === BlogPostType.TRIP &&
      isTripFrontmatter(a.frontmatter) &&
      isTripFrontmatter(b.frontmatter)
    ) {
      if (a.frontmatter.dateFrom === b.frontmatter.dateFrom) return 0;
      return a.frontmatter.dateFrom > b.frontmatter.dateFrom ? -1 : 1;
    }
    return 0;
  });
}
