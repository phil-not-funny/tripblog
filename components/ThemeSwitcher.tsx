"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const t = useTranslations();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
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
          {dark ? <Sun /> : <Moon />}
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
}
