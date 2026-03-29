import { getDictionary } from "@/app/[lang]/dictionaries";
import { Locale } from "@/types/internationalization";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default async function BlogFacts({
  facts,
  lang,
  title,
}: {
  facts: BlogFact[];
  lang: Locale;
  title: string;
}) {
  return (
    <section className="p-6 bg-card backdrop-blur rounded-2xl shadow-sm space-y-2">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <ul className="grid sm:grid-cols-2 gap-y-1 text-card-foreground">
        {facts.map((fact, index) => (
          <BlogFact
            key={index}
            icon={fact.icon}
            label={fact.label}
            value={fact.value}
            colspan={fact.colspan}
            borderAbove={fact.borderAbove}
            lang={lang}
          />
        ))}
      </ul>
    </section>
  );
}

export interface BlogFact {
  icon: IconName;
  label: string;
  value?: string | number;
  colspan?: boolean;
  borderAbove?: boolean;
}

export async function BlogFact({
  icon,
  label,
  value,
  colspan = false,
  borderAbove = false,
  lang,
}: BlogFact & { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <li
      className={`flex flex-row gap-2 ${colspan && "col-span-2"} ${
        borderAbove && "border-t pt-2 border-t-muted-foreground"
      }`}
    >
      <span className="font-medium">
        <Tooltip>
          <TooltipTrigger>
            <DynamicIcon
              name={icon}
              className="size-5 block text-card-foreground"
            />
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </span>
      <span className={!value ? "italic" : undefined}>
        {value ?? dict.global.dynamic.noData}
      </span>
    </li>
  );
}
