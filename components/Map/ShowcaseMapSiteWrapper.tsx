"use client";

import { Locale } from "@/types/internationalization";
import { ShowcaseMap } from "./Map";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { flattenShowcaseMapLocations } from "@/lib/showcase";
import { ShowcaseMapLocation } from "@/types/content";
import { useTranslations } from "next-intl";

export default function ShowcaseMapSiteWrapper({
  lang,
  locations: startingLocations,
}: {
  lang: Locale;
  locations: ShowcaseMapLocation[];
}) {
  const [grouped, setGrouped] = useState(false);
  const [locations, setLocations] = useState(startingLocations);

  const t = useTranslations();

  useEffect(() => {
    setLocations(
      grouped
        ? flattenShowcaseMapLocations(startingLocations)
        : startingLocations,
    );
  }, [grouped, startingLocations]);

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-2">
        <Switch
          id="switch-grouped"
          checked={grouped}
          onCheckedChange={setGrouped}
          aria-label={t("components.map.groupToggle")}
        />
        <label htmlFor="switch-grouped">
          {t("components.map.groupToggle")}
        </label>
      </div>
      <ShowcaseMap
        regioned={!grouped}
        grouped={grouped}
        locations={locations}
        locale={lang as Locale}
      />
    </div>
  );
}
