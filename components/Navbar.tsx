"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { LanguagesIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Locale } from "@/types/internationalization";
import { useState } from "react";
import { DropdownMenuRadioGroup } from "./ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCookies } from "next-client-cookies";

export default function Navbar({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const cookies = useCookies();
  const t = useTranslations();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/trips", label: t("global.trips") },
    { href: "/hikes", label: t("global.hikes") },
  ];

  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    (params?.lang as Locale) || Locale.EN
  );

  const handleLocaleChange = async (newLocale: Locale) => {
    setSelectedLocale(newLocale);
    router.replace(`/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "")}`);
    cookies.set("locale", newLocale, {
      path: "/",
      secure: false,
      sameSite: "lax",
    });
  };

  return (
    <NavigationMenu className="p-4 shadow-md min-w-full relative md:block flex flex-col gap-2 md:gap-0">
      <NavigationMenuList>
        {navItems.map((item, idx) => (
          <NavigationMenuItem key={item.label}>
            <Link
              href={`/${locale}${item.href}`}
              className={`font-semibold px-2 ${
                idx !== 0 && "border-l-2 border-l-neutral-600"
              }`}
            >
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="md:absolute right-2 top-2 p-4" variant={"ghost"}>
            {t("components.Navbar.selectLanguage")}{" "}
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
    </NavigationMenu>
  );
}
