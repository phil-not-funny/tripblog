import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { BlogPostType, HikePost } from "@/types/content";

export async function generateStaticParams() {
  return getPostSlugs(BlogPostType.HIKE).map((slug) => ({
    slug: slug.replace(".md", ""),
  }));
}

export default async function HikesPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(BlogPostType.HIKE, params.slug + ".md") as HikePost;

  return (
    <article className="prose mx-auto">
      <h1>{post.frontmatter.destination}</h1>
      <p className="text-sm opacity-70">{post.frontmatter.type}</p>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}