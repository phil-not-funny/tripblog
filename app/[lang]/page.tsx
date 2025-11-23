import { Locale } from "@/types/internationalization";
import { getDictionary } from "./dictionaries";

export default async function Home({ params }: { params: { lang: string } }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <h1 className="text-2xl font-bold">{dict.home.welcome}</h1>
    </div>
  );
}
