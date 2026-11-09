import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceGlyph } from "@/components/ServiceGlyph";
import { serviceHref } from "@/lib/content/links";
import { getHome } from "@/lib/content/select";

export function Services() {
  const { services, visible } = getHome();
  if (!visible.services) return null;
  return (
    <Reveal>
      <section id="services" className="mx-auto max-w-content px-2 py-8 md:px-3 md:py-14">
        <SectionHeading section="services" />
        <Stagger className="mt-4 border-b border-text md:mt-8">
          {services.map((service, index) => {
            const href = serviceHref(service);
            return (
              <article
                key={service.slug}
                data-service
                className={`draw-scope grid gap-2 border-t border-border py-3 md:grid-cols-12 md:gap-4 md:py-5 ${
                  href ? "card-link" : ""
                }`}
              >
                <div className="size-10 md:col-span-2 md:size-14">
                  <ServiceGlyph index={index} />
                </div>
                <div className="md:col-span-6">
                  <p className="font-mono text-xs text-muted">{service.title}</p>
                  <h3 className="type-display mt-1 text-3xl">
                    {href ? (
                      <Link
                        href={href}
                        prefetch={false}
                        className="inline-flex min-h-(--size-target) items-center after:absolute after:inset-0"
                      >
                        {service.outcomeHeadline}
                      </Link>
                    ) : (
                      service.outcomeHeadline
                    )}
                  </h3>
                  <p className="mt-1 max-w-text text-lg text-muted">{service.oneLine}</p>
                </div>
                <ul className="flex flex-col self-end text-sm md:col-span-4">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable} className="border-t border-border py-1">
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Stagger>
      </section>
    </Reveal>
  );
}
