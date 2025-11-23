import { Locale } from "@/types/internationalization";

export function formatDateByLocale(
  dateString: string,
  locale: Locale,
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"]
): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle || "full",
  }).format(date);
}
