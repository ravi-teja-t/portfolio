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
        className="mx-auto grid max-w-content gap-4 px-2 py-8 md:grid-cols-2 md:gap-8 md:px-3 md:py-14"
      >
        <div className="md:sticky md:top-12 md:self-start">
          <SectionHeading section="howIWork" />
        </div>
        <TimelineLine>
          <ol className="flex flex-col gap-5 md:gap-8">
            {howIWork.map((step, index) => (
              <li key={step.title} className="relative flex gap-2 md:gap-3">
                <span className="relative z-10 flex size-5.5 shrink-0 items-center justify-center border border-text bg-bg font-mono text-sm font-medium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="type-display text-2xl">{step.title}</h3>
                  <p className="mt-1 text-lg text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TimelineLine>
      </section>
    </Reveal>
  );
}
