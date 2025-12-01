import BlogList from "@/components/BlogList";
import { BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";

export default async function TripsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <BlogList type={BlogPostType.TRIP} locale={lang as Locale} />;
}
