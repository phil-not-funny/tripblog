import BlogList from "@/components/BlogList";
import { BlogPostType } from "@/types/content";
import { Locale } from "@/types/internationalization";
import { getDictionary } from "../dictionaries";
import { Metadata } from "next";

export default async function TripsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <BlogList type={BlogPostType.TRIP} locale={lang as Locale} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const dict = await getDictionary(lang as Locale);

  return {
    title: {
      default: dict.global.trips,
      template: `${dict.global.trips} \u2014 %s`,
    },
  };
}
