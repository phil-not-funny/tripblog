import {
  asHumanReadable,
  asSingleHumanReadable,
  getPostSlugs,
} from "@/lib/posts";
import { BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";
import Link from "next/link";

export default async function TripsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const posts = getPostSlugs(BlogPostType.TRIP, lang as Locale);
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold block">TRIPS</h1>
      <p className="w-full block text-center">Look at these trips:</p>
      <ul>
        {posts.map((slug) => (
          <li key={slug} className="text-center">
            <Link
              className="hover:underline"
              href={`/${lang}/trips/${slug.replace(/.md$/, "")}`}
            >
              {asSingleHumanReadable(slug)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const dynamic = "force-static";
