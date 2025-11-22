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
import { Locale } from "@/types/internationalization";

const contentDir = path.join(process.cwd(), "content");

export function getPostSlugs(type: BlogPostType, locale: Locale): string[] {
  const dir = path.join(contentDir, type);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  console.log("🔎 Entries in dir", entries);

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(`.${locale}.md`))
    .map((name) => name.replace(`.${locale}.md`, ""));
}

export function asHumanReadable(slugs: string[]): string[] {
  return slugs.map((slug) => asSingleHumanReadable(slug));
}

export function asSingleHumanReadable(slug: string): string {
  return (
    slug.charAt(0).toUpperCase() +
    slug
      .slice(1)
      .replace(/-/g, " ")
      .replace(/\.md$/, "")
      .replace(new RegExp(`\\.${Locale.EN}|\\.${Locale.DE}|$`), "")
  );
}

export async function getPostBySlug(
  type: BlogPostType,
  slug: string,
  locale: Locale
): Promise<BlogPost> {
  console.log("ℹ️ slug", slug);
  console.log("ℹ️ type", type);

  const fullPath = path.join(contentDir, type, `${slug}.${locale}.md`);
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
      slug: slug,
      frontmatter: data as TripFrontmatter,
      html: contentHtml,
      locale: locale,
    };
  } else {
    return {
      type: BlogPostType.HIKE,
      slug: slug,
      frontmatter: data as HikeFrontmatter,
      html: contentHtml,
      locale: locale,
    };
  }
}

export async function getAllPosts(
  type: BlogPostType,
  locale: Locale
): Promise<BlogPost[]> {
  const slugs = getPostSlugs(type, locale);
  const posts = await Promise.all(
    slugs.map((s) => getPostBySlug(type, s, locale))
  );
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
