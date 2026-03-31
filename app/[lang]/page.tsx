import { Locale } from "@/types/internationalization";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-2">
      <h1 className="text-4xl font-bold text-center w-full">
        {dict.home.welcome}
      </h1>
      <p>{dict.home.description}</p>
    </div>
  );
}
