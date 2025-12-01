import BlogList from "@/components/BlogList";
import { BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";

export default async function HikesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <BlogList type={BlogPostType.HIKE} locale={lang as Locale} />;
}
