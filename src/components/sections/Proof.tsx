import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function Proof() {
  const { metrics, visible } = getHome();
  if (!visible.proof) return null;
  return (
    <Reveal>
      <section id="proof" className="bg-surface">
        <div className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-8">
          <SectionHeading section="proof" />
          <Stagger className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
                <p className="mt-0.5 text-sm text-muted">{metric.label}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </Reveal>
  );
}
