import { Locale } from "@/types/internationalization";

export function formatDateByLocale(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date); // Ensure locale is valid
}
