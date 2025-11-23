import { getDictionary } from "@/app/[lang]/dictionaries";
import { TripPost } from "@/types/content";
import { Locale } from "@/types/internationalization";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default async function TripFacts({
  facts,
  lang,
}: {
  facts: TripFact[];
  lang: Locale;
}) {
  const dict = await getDictionary(lang);

  return (
    <section className="p-6 bg-white/60 backdrop-blur rounded-2xl shadow-sm space-y-2">
      <h2 className="text-lg font-semibold text-neutral-800">
        {dict.hikes.dynamic.tourInfo}
      </h2>

      <ul className="grid sm:grid-cols-2 gap-y-1 text-neutral-700">
        {facts.map((fact, index) => (
          <TripFact
            key={index}
            icon={fact.icon}
            label={fact.label}
            value={fact.value}
            colspan={fact.colspan}
            borderAbove={fact.borderAbove}
          />
        ))}
      </ul>
    </section>
  );
}

export interface TripFact {
  icon: IconName;
  label: string;
  value: string | number;
  colspan?: boolean;
  borderAbove?: boolean;
}

export function TripFact({
  icon,
  label,
  value,
  colspan = false,
  borderAbove = false,
}: TripFact) {
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
      <span>{value}</span>
    </li>
  );
}
