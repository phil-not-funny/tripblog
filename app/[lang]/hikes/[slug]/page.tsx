import SimpleMap from "@/components/Map";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, HikePost } from "@/types/content";
import { Locale } from "@/types/internationalization";

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

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      {/* Title block */}
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {fm.title}
        </h1>

        <p className="text-sm font-medium text-neutral-600">{fm.type}</p>
      </header>

      {/* Metadata card */}
      <section className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-white/40 space-y-2">
        <h2 className="text-lg font-semibold text-neutral-800">Tour Info</h2>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-neutral-700">
          <li>
            <span className="font-medium">Massiv:</span> {fm.massive}
          </li>
          <li>
            <span className="font-medium">Start:</span> {fm.from}
          </li>
          <li>
            <span className="font-medium">Aufstieg via:</span> {fm.viaUp}
          </li>
          <li>
            <span className="font-medium">Abstieg via:</span> {fm.viaReturn}
          </li>
          <li>
            <span className="font-medium">Höhenmeter:</span> {fm.totalHM} hm
          </li>
          <li>
            <span className="font-medium">Gehzeit:</span> {fm.totalMinutes} min
          </li>
          <li>
            <span className="font-medium">Schwierigkeit:</span> {fm.difficulty}
          </li>
          <li>
            <span className="font-medium">Weg:</span> {fm.path}
          </li>
        </ul>
      </section>

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
