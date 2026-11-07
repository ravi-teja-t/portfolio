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
        <div className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-10">
          <SectionHeading section="testimonials" />
          <Stagger className="mt-3 grid gap-2 md:mt-4 md:grid-cols-3">
            {testimonials.map((testimonial) => {
              const attribution = [testimonial.name, testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(", ");
              return (
                <figure
                  key={testimonial.quote}
                  className="h-full rounded-md border border-border bg-bg p-3"
                >
                  <blockquote className="text-lg">{testimonial.quote}</blockquote>
                  {attribution && (
                    <figcaption className="mt-2 text-sm text-muted">{attribution}</figcaption>
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
