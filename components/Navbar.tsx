"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useTranslations } from "next-intl";
import ThemeSwitcher from "./ThemeSwitcher";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar({ locale }: { locale: string }) {
  const t = useTranslations();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/trips", label: t("global.trips") },
    { href: "/hikes", label: t("global.hikes") },
    { href: "/showcase-map", label: t("global.showcaseMap") },
  ];

  return (
    <NavigationMenu className="p-4 shadow-md min-w-full relative md:block flex flex-col gap-2 md:gap-0">
      <NavigationMenuList>
        {navItems.map((item, idx) => (
          <NavigationMenuItem key={item.label}>
            <Link
              href={`/${locale}${item.href}`}
              className={`font-semibold px-4 hover:underline underline-offset-2 tracking-widest uppercase ${
                idx !== 0 && "border-l-2 border-l-neutral-600"
              }`}
            >
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <div className="md:absolute right-2 top-2 flex items-center gap-1">
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </NavigationMenu>
  );
}
