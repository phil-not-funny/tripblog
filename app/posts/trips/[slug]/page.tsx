import SimpleMap from "@/components/Map";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, TripPost } from "@/types/content";

export async function generateStaticParams() {
  return getPostSlugs(BlogPostType.TRIP).map((slug) => ({
    slug: slug.replace(".md", ""),
  }));
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = (await getPostBySlug(
    BlogPostType.TRIP,
    slug + ".md"
  )) as TripPost;

  const fm = post.frontmatter;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {fm.title}
        </h1>

        <p className="text-sm text-neutral-600">
          {fm.type} trip • {fm.region}, {fm.country}
        </p>
      </header>

      {/* Trip meta info */}
      <section className="p-6 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-white/40 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Trip Info</h2>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-neutral-700">
          <li>
            <span className="font-medium">From:</span> {fm.dateFrom}
          </li>
          <li>
            <span className="font-medium">To:</span> {fm.dateTo}
          </li>
          <li>
            <span className="font-medium">Country:</span> {fm.country}
          </li>
          <li>
            <span className="font-medium">Region:</span> {fm.region}
          </li>
          <li>
            <span className="font-medium">Type:</span> {fm.type}
          </li>
        </ul>
      </section>
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
          max-w-none
        "
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}

export const dynamic = "force-static";
