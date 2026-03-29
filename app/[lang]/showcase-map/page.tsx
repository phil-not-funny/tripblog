import { Locale } from "@/types/internationalization";
import { getDictionary } from "../dictionaries";
import SimpleMap, { ShowcaseMap } from "@/components/Map";
import { Marker } from "react-leaflet";
import { getShowcaseMapLocations } from "@/lib/showcase";
import { coloredMarker } from "@/components/MapClient";
import { Metadata } from "next";

export default async function TheMapPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const locations = await getShowcaseMapLocations();

  return (
    <article className="max-w-6xl mx-auto px-6 py-16 space-y-8">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {dict.showcase.title}
        </h1>
        <p className="text-accent-foreground my-3">
          {dict.showcase.description}
        </p>
      </header>
      <ShowcaseMap locations={locations} locale={lang as Locale} />
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.global.showcaseMap,
  };
}
