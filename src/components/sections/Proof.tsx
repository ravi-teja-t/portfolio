import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function Proof() {
  const { metrics, visible } = getHome();
  if (!visible.proof) return null;
  return (
    <Reveal>
      <section id="proof" className="bg-ink text-on-ink">
        <div className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-10">
          <SectionHeading section="proof" />
          <Stagger className="mt-4 grid grid-cols-2 gap-3 md:mt-6 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="border-t border-ink-line pt-1.5">
                <p className="type-display text-heading">{metric.value}</p>
                <p className="mt-1 text-sm text-on-ink-muted">{metric.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </Reveal>
  );
}
