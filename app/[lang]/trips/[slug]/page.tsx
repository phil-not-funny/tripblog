import SimpleMap from "@/components/Map";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, TripPost } from "@/types/content";
import { Locale } from "@/types/internationalization";
import { getDictionary } from "../../dictionaries";
import BlogFacts, { BlogFact } from "@/components/BlogFacts";
import { formatDateByLocale } from "@/lib/date";

export async function generateStaticParams() {
  return Object.values(Locale).flatMap((locale) =>
    getPostSlugs(BlogPostType.TRIP, locale).map((slug) => ({ locale, slug }))
  );
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;

  const post = (await getPostBySlug(
    BlogPostType.TRIP,
    slug,
    lang as Locale
  )) as TripPost;

  const fm = post.frontmatter;

  const dict = await getDictionary(lang as Locale);

  const facts: BlogFact[] = [
    {
      icon: "calendar",
      label: dict.trips.dynamic.labels.dateRange,
      value: `${formatDateByLocale(fm.dateFrom, lang as Locale, "medium")}${
        fm.dateTo &&
        " - " + formatDateByLocale(fm.dateTo, lang as Locale, "medium")
      }`,
      colspan: true,
    },
    {
      icon: "map-pinned",
      label: dict.trips.dynamic.labels.location,
      value: `${fm.name}, ${fm.region && fm.region + ", "}${fm.country}`,
    },
  ];

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {fm.title}
        </h1>
        <p className="text-neutral-700 my-3">{fm.shortDescription}</p>
        <div className="max-w-1/3 border-b mb-3 border-b-neutral-600"></div>
        <p className="text-sm text-neutral-600">
          <b>{dict.trips.dynamic.labels.type}:</b>{" "}
          {dict.trips.dynamic.enums.type[fm.type]}
        </p>
      </header>

      <BlogFacts
        lang={lang as Locale}
        title={dict.trips.dynamic.infoBlock}
        facts={facts}
      />

      {fm.introLat && fm.introLng && (
        <SimpleMap lat={fm.introLat} lng={fm.introLng} zoom={12} />
      )}
      {/* Markdown content */}
      <div
        className="
          prose prose-neutral 
          prose-headings:font-semibold 
          prose-headings:text-neutral-900
          prose-h1:text-3xl 
          prose-h2:text-2xl
          prose-p:leading-relaxed
          prose-img:rounded-md
          prose-img:shadow-
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}

export const dynamic = "force-static";
