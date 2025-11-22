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
import { useEffect, useState } from "react";
import { DropdownMenuRadioGroup } from "./ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/hikes", label: "Hikes" },
];

export default function Navbar({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    (params?.lang as Locale) || Locale.EN
  );

  const handleLocaleChange = (newLocale: Locale) => {
    setSelectedLocale(newLocale);
    router.replace(`/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "")}`);
    console.log(pathname);
  };

  return (
    <NavigationMenu className="p-4 shadow-md min-w-full relative">
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
          <Button className="absolute right-2 top-2 p-4" variant={"ghost"}>
            Select Language <LanguagesIcon className="size-5" />
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
                {lang}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </NavigationMenu>
  );
}
