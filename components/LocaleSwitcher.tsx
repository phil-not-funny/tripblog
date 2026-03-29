"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LanguagesIcon } from "lucide-react";
import { Locale } from "@/types/internationalization";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCookies } from "next-client-cookies";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const cookies = useCookies();
  const t = useTranslations();

  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    (params?.lang as Locale) || Locale.EN,
  );

  const handleLocaleChange = (newLocale: Locale) => {
    setSelectedLocale(newLocale);
    router.replace(`/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "")}`);
    cookies.set("locale", newLocale, {
      path: "/",
      secure: false,
      sameSite: "lax",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-4" variant="default">
          {t("components.Navbar.selectLanguage")}
          <LanguagesIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={selectedLocale}
          onValueChange={(value) => handleLocaleChange(value as Locale)}
        >
          {Object.values(Locale).map((lang) => (
            <DropdownMenuRadioItem
              className="cursor-pointer"
              value={lang}
              key={lang}
            >
              {t(`locales.${lang}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
