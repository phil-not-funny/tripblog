/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const t = useTranslations();
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDark = theme
      ? theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Tooltip>
      <TooltipContent>{t("components.themeSwitcher.toggle")}</TooltipContent>
      <TooltipTrigger asChild>
        <Button
          variant="default"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {dark === null ? <Loader /> : dark ? <Sun /> : <Moon />}
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
}
