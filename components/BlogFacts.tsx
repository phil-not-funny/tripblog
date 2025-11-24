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
    <section className="p-6 bg-white/60 backdrop-blur rounded-2xl shadow-sm space-y-2">
      <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>

      <ul className="grid sm:grid-cols-2 gap-y-1 text-neutral-700">
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
        borderAbove && "border-t pt-2 border-t-neutral-600"
      }`}
    >
      <span className="font-medium">
        <Tooltip>
          <TooltipTrigger>
            <DynamicIcon name={icon} className="size-5 block" />
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
