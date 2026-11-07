import { loadContent } from "@/lib/content/load";
import type { Sections } from "@/lib/content/schemas";

export function SectionHeading({ section }: { section: keyof Sections }) {
  const { sections } = loadContent();
  return <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{sections[section]}</h2>;
}
