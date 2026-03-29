import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/types/internationalization";

export default async function Footer({ locale }: { locale: string }) {
  const dict = await getDictionary(locale as Locale);

  return (
    <footer className="w-full bg-background/60 backdrop-blur-sm shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-4xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Philip Schrenk.{" "}
          {dict.components.Footer.allRightsReserved}
        </p>
        <p className="text-sm text-muted-foreground">
          {dict.components.Footer.builtWith} Next.js &amp; React Leaflet
        </p>
      </div>
    </footer>
  );
}
