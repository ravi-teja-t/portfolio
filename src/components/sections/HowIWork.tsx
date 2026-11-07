import { Reveal } from "@/components/motion/Reveal";
import { TimelineLine } from "@/components/motion/TimelineLine";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function HowIWork() {
  const { howIWork, visible } = getHome();
  if (!visible["how-i-work"]) return null;
  return (
    <Reveal>
      <section
        id="how-i-work"
        className="mx-auto grid max-w-content gap-3 px-2 py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-3 md:py-10"
      >
        <SectionHeading section="howIWork" />
        <TimelineLine>
          <ol className="flex flex-col gap-3">
            {howIWork.map((step, index) => (
              <li key={step.title} className="relative flex gap-2">
                <span className="relative z-10 flex size-5.5 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-mono text-sm font-medium">
                  {index + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-lg font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-0.5 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TimelineLine>
      </section>
    </Reveal>
  );
}
