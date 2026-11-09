import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function Testimonials() {
  const { testimonials, visible } = getHome();
  if (!visible.testimonials) return null;
  return (
    <Reveal>
      <section id="testimonials" className="bg-surface">
        <div className="mx-auto max-w-content px-2 py-8 md:px-3 md:py-14">
          <SectionHeading section="testimonials" />
          <Stagger className="mt-4 grid gap-4 md:mt-6 md:grid-cols-3">
            {testimonials.map((testimonial) => {
              const attribution = [testimonial.name, testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(", ");
              return (
                <figure key={testimonial.quote} className="h-full border-t border-text pt-2">
                  <blockquote className="type-display text-2xl">{testimonial.quote}</blockquote>
                  {attribution && (
                    <figcaption className="mt-2 font-mono text-xs text-muted">
                      {attribution}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </Stagger>
        </div>
      </section>
    </Reveal>
  );
}
