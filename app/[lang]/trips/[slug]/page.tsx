import SimpleMap from "@/components/Map";
import { getImagePaths, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, TripPost } from "@/types/content";
import { Locale } from "@/types/internationalization";
import { getDictionary } from "../../dictionaries";
import BlogFacts, { BlogFact } from "@/components/BlogFacts";
import { formatDateByLocale } from "@/lib/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Gallery from "@/components/Gallery";
import BlogMdContent from "@/components/BlogMdContent";

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
      value: `${fm.name}, ${fm.region ? fm.region + ", " : ""}${fm.country}`,
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

      <Tabs defaultValue="blog" className="w-full flex flex-col space-y-8">
        <TabsList className=" self-center">
          <TabsTrigger value="blog" className="px-8 py-4 text-lg">
            {dict.components.PageSwitcher.blog.toUpperCase()}
          </TabsTrigger>
          <TabsTrigger value="gallery" className="px-8 py-4 text-lg">
            {dict.components.PageSwitcher.gallery.toUpperCase()}
          </TabsTrigger>
        </TabsList>
        <BlogFacts
          lang={lang as Locale}
          title={dict.trips.dynamic.infoBlock}
          facts={facts}
        />

        {fm.introLat && fm.introLng && (
          <SimpleMap lat={fm.introLat} lng={fm.introLng} zoom={12} />
        )}

        <TabsContent value="blog" className="w-full">
          <BlogMdContent post={post} />
        </TabsContent>

        <TabsContent value="gallery" className="w-full">
          <Gallery imagePaths={getImagePaths(post)} />
        </TabsContent>
      </Tabs>
    </article>
  );
}

export const dynamic = "force-static";
