/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeToc from "rehype-toc";
import {
  type BlogPost,
  BlogPostType,
  HikeFrontmatter,
  isHikeFrontmatter,
  isHikePosts,
  isTripFrontmatter,
  isTripPosts,
  TripFrontmatter,
} from "@/types/content";
import { Locale } from "@/types/internationalization";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Metadata } from "next";

const contentDir = path.join(process.cwd(), "content");

export function getPostSlugs(type: BlogPostType, locale: Locale): string[] {
  const dir = path.join(contentDir, type);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => !name.includes("template"))
    .filter((name) => name.endsWith(`.${locale}.md`))
    .map((name) => name.replace(`.${locale}.md`, ""));
}

export async function getPostBySlug(
  type: BlogPostType,
  slug: string,
  locale: Locale,
): Promise<BlogPost> {
  const dict = await getDictionary(locale);

  const fullPath = path.join(contentDir, type, `${slug}.${locale}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  if (!(isHikeFrontmatter(data) || isTripFrontmatter(data))) {
    throw new Error(`Invalid frontmatter in post: ${slug}`);
  }

  const processed = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug) // gives each heading an ID
    .use(rehypeAutolink, { behavior: "wrap" })
    .use(data.disableToc ? () => (tree) => tree : rehypeToc, {
      headings: ["h1", "h2", "h3"],
      customizeTOC(toc) {
        return {
          type: "element",
          tagName: "div",
          properties: {
            id: "toc",
            className:
              "not-prose p-6 bg-white/60 backdrop-blur rounded-2xl shadow-sm space-y-2 ol-",
          },
          children: [
            {
              type: "element",
              tagName: "h1",
              properties: {
                className: "text-lg font-semibold text-neutral-800",
              },
              children: [
                { type: "text", value: dict.global.dynamic.tableOfContents },
              ],
            },
            toc,
          ],
        };
      },
      customizeTOCItem(tocItem) {
        return {
          ...tocItem,
          properties: {
            className: "ml-4",
          },
          children: tocItem.children.map((c) =>
            c.type === "element" && (c as any).tagName === "a"
              ? {
                  ...c,
                  properties: {
                    ...(c as any).properties,
                    className:
                      "before:content-['↪_'] hover:underline hover:cursor-pointer",
                  },
                }
              : c,
          ),
        };
      },
    })
    .use(rehypeStringify)
    .process(content);
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
  locale: Locale,
): Promise<BlogPost[]> {
  const slugs = getPostSlugs(type, locale);
  const posts = await Promise.all(
    slugs.map((s) => getPostBySlug(type, s, locale)),
  );
  return sortPosts(posts);
}

export function getImagePaths(blog: BlogPost): string[] {
  const contentDir = path.join(
    "public",
    "content",
    blog.type.toLocaleLowerCase(),
    blog.slug,
  );

  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    const imageFiles = files.filter((file) =>
      [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(
        path.extname(file).toLowerCase(),
      ),
    );
    return imageFiles.map((file) =>
      path.join("/content", blog.type.toLocaleLowerCase(), blog.slug, file),
    );
  }
  return [];
}

export function sortPosts(blogs: BlogPost[]): BlogPost[] {
  // --- TRIPS ---
  if (isTripPosts(blogs)) {
    return blogs.sort((a, b) => {
      const aDate = Date.parse(a.frontmatter.dateFrom) ?? 0;
      const bDate = Date.parse(b.frontmatter.dateFrom) ?? 0;

      // 1) date DESC
      if (aDate !== bDate) return bDate - aDate;

      const aWeight = a.frontmatter.internalWeight ?? 0;
      const bWeight = b.frontmatter.internalWeight ?? 0;

      // 2) weight DESC
      if (aWeight !== bWeight) return bWeight - aWeight;

      // 3) title ASC
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  }

  // --- HIKES ---
  if (isHikePosts(blogs)) {
    return blogs.sort((a, b) => {
      const aWeight = a.frontmatter.internalWeight ?? 0;
      const bWeight = b.frontmatter.internalWeight ?? 0;

      // 1) weight DESC
      if (aWeight !== bWeight) return bWeight - aWeight;

      // 2) title ASC
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  }

  throw new Error("❗Unknown blog post type for sorting");
}
