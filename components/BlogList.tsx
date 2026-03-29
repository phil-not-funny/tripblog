import { getDictionary } from "@/app/[lang]/dictionaries";
import { getAllPosts, getPostSlugs } from "@/lib/posts";
import { slugToUrl } from "@/lib/strings";
import { BlogPost, BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export default async function BlogList({
  type,
  locale,
}: {
  type: BlogPostType;
  locale: Locale;
}) {
  const posts = await getAllPosts(type, locale);
  const dict = await getDictionary(locale);

  const blogTypeToPlural: Record<BlogPostType, keyof typeof dict.global> = {
    [BlogPostType.TRIP]: "trips",
    [BlogPostType.HIKE]: "hikes",
  };

  const stringedType = dict.global[blogTypeToPlural[type]] as string;

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 space-y-8">
      <header className="w-full flex flex-col items-center">
        <h1 className="text-4xl uppercase tracking-wider font-semibold text-foreground">
          {stringedType}
        </h1>
        <p className="w-full block text-center mt-3">
          {dict.components.BlogList.subtitle.replace("${type}", stringedType)}
        </p>
      </header>
      <ul className="gap-2 flex flex-col items-center mt-4">
        {posts.map((blog, idx) => (
          <Fragment key={blog.slug}>
            <BlogListItem key={blog.slug} blog={blog} />
            {posts.length - 1 !== idx && (
              <div className="my-2 border-b border-b-muted-foreground w-2xs!" />
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

export async function BlogListItem({ blog }: { blog: BlogPost }) {
  return (
    <Link href={await slugToUrl(blog)}>
      <li className="bg-card p-6 shadow-md rounded-lg max-w-lg w-lg flex flex-col items-center text-wrap transition-all duration-75 hover:shadow-lg hover:scale-[1.02] active:scale-[1.08]">
        <span className="font-semibold tracking-wide text-lg">
          {blog.frontmatter.title}
        </span>
        <p className="italic text-accent-foreground tracking-tight min-w-md text-sm text-center">
          {blog.frontmatter.shortDescription}
        </p>
      </li>
    </Link>
  );
}
