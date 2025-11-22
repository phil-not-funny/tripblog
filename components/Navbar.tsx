"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/hikes", label: "Hikes" },
];

export default function Navbar({ locale }: { locale: string }) {
  return (
    <NavigationMenu className="p-4 shadow-md min-w-full">
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
    </NavigationMenu>
  );
}
