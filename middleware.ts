import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Locale } from "./types/internationalization";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Redirect to correct i18n route if accessing root
  if (url.pathname === "/") {
    // detect language from Accept-Language header
    const acceptLang =
      req.headers.get("accept-language")?.split(",")[0] || "en";

    // default to en if not supported
    const supportedLangs = Object.values(Locale) as string[];
    const lang = supportedLangs.includes(acceptLang) ? acceptLang : "en";

    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
