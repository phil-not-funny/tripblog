import {
  asSingleHumanReadable,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";
import { BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";
import Link from "next/link";

export default async function HikesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = getPostSlugs(BlogPostType.HIKE, lang as Locale);
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold">HIKES</h1>
      <p className="w-full block text-center">Look at these hikes:</p>
      <ul>
        {posts.map((slug) => (
          <li key={slug} className="text-center">
            <Link
              className="hover:underline"
              href={`/${lang}/hikes/${slug.replace(/.md$/, "")}`}
            >
              {getPostBySlug(BlogPostType.HIKE, slug, lang as Locale).then(
                (post) => post.frontmatter.title
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
