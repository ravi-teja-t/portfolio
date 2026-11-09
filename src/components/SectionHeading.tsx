import { loadContent } from "@/lib/content/load";
import type { Sections } from "@/lib/content/schemas";

export function SectionHeading({ section }: { section: keyof Sections }) {
  const { sections } = loadContent();
  return (
    <div className="section-head">
      <h2 className="section-title type-display text-heading">{sections[section]}</h2>
    </div>
  );
}
