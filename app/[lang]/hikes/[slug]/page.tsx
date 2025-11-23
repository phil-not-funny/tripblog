import SimpleMap from "@/components/Map";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, HikeFrontmatter, HikePost } from "@/types/content";
import { Locale } from "@/types/internationalization";
import { getDictionary } from "../../dictionaries";
import { ArrowUpRight, LandPlot, MapPin, TypeIcon } from "lucide-react";
import TripFacts, { TripFact } from "@/components/TripFacts";

export async function generateStaticParams() {
  return Object.values(Locale).flatMap((locale) =>
    getPostSlugs(BlogPostType.HIKE, locale).map((slug) => ({ locale, slug }))
  );
}

export default async function HikesPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await params;

  const post = (await getPostBySlug(
    BlogPostType.HIKE,
    slug,
    lang as Locale
  )) as HikePost;

  const fm = post.frontmatter;

  const dict = await getDictionary(lang as Locale);

  const formatTitle = (fm: HikeFrontmatter): string => {
    return `${fm.destination}${fm.massive && ` (${fm.massive})`} ${
      dict.global.from
    } ${fm.from} ${
      fm.viaUp ||
      (fm.viaReturn && `${dict.global.via} ${fm.viaUp || fm.viaReturn}`)
    }`;
  };

  const facts: TripFact[] = [
    {
      icon: "parking-circle",
      label: dict.hikes.dynamic.labels.from,
      value: fm.from,
    },
    {
      icon: "mountain",
      label: dict.hikes.dynamic.labels.destination,
      value: fm.destination,
    },
    {
      icon: "land-plot",
      label: dict.hikes.dynamic.labels.massive,
      value: fm.massive || dict.global.no,
    },
    {
      icon: "route",
      label: dict.hikes.dynamic.labels.path,
      value: fm.path,
    },
    {
      icon: "arrow-up-right",
      label: dict.hikes.dynamic.labels.viaUp,
      value: fm.viaUp || dict.global.no,
      borderAbove: true,
    },
    {
      icon: "arrow-down-right",
      label: dict.hikes.dynamic.labels.viaReturn,
      value: fm.viaReturn || dict.global.no,
      borderAbove: true,
    },
    {
      icon: "arrow-up-from-line",
      label: dict.hikes.dynamic.labels.fromHM,
      value: `${fm.fromHM} m`,
      borderAbove: true,
    },
    {
      icon: "arrow-up-to-line",
      label: dict.hikes.dynamic.labels.toHM,
      value: `${fm.toHM} m`,
      borderAbove: true,
    },
    {
      icon: "move-vertical",
      label: dict.hikes.dynamic.labels.totalHM,
      value: `${fm.totalHM} m`,
      colspan: true,
    },
    {
      icon: "clock-4",
      label: dict.hikes.dynamic.labels.walkingMinutes,
      value: `${fm.walkingMinutes} min`,
      borderAbove: true,
    },
    {
      icon: "clock-fading",
      label: dict.hikes.dynamic.labels.totalMinutes,
      value: `${fm.totalMinutes} min`,
      borderAbove: true,
    },
  ];

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight pb-1 border-b border-b-neutral-500 text-neutral-900">
          {fm.title}
        </h1>
        <p className="text-sm text-neutral-600">
          <b>{dict.hikes.dynamic.detailedName}:</b> {formatTitle(fm)}
        </p>
        <p className="text-sm text-neutral-600">
          <b>{dict.hikes.dynamic.labels.difficulty}:</b>{" "}
          {dict.hikes.dynamic.enums.difficulty[fm.difficulty]}
        </p>
        <p className="text-sm text-neutral-600">
          <b>{dict.hikes.dynamic.labels.type}:</b>{" "}
          {dict.hikes.dynamic.enums.type[fm.type]}
        </p>
      </header>

      <TripFacts facts={facts} lang={lang as Locale} />

      {fm.introLat && fm.introLng && (
        <SimpleMap lat={fm.introLat} lng={fm.introLng} zoom={12} />
      )}
      {/* Content */}
      <div
        className="
          prose prose-neutral 
          prose-headings:font-semibold 
          prose-headings:text-neutral-900
          prose-h1:text-3xl 
          prose-h2:text-2xl
          prose-p:leading-relaxed
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}

export const dynamic = "force-static";
