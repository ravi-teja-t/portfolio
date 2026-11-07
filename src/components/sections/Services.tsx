import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { serviceHref } from "@/lib/content/links";
import { getHome } from "@/lib/content/select";

export function Services() {
  const { services, visible } = getHome();
  if (!visible.services) return null;
  return (
    <Reveal>
      <section id="services" className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-10">
        <SectionHeading section="services" />
        <Stagger className="mt-3 grid gap-2 md:mt-4 md:grid-cols-2">
          {services.map((service) => {
            const href = serviceHref(service);
            return (
              <article
                key={service.slug}
                data-service
                className={`h-full rounded-md border border-border bg-bg p-3 ${href ? "card-link" : ""}`}
              >
                <p className="font-mono text-xs text-muted">{service.title}</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight">
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
                <p className="mt-1 text-muted">{service.oneLine}</p>
                <ul className="mt-2 flex flex-col gap-0.5 text-sm">
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex gap-1">
                      <span aria-hidden className="text-muted">
                        —
                      </span>
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
