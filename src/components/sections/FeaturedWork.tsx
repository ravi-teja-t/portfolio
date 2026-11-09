import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SectionHeading } from "@/components/SectionHeading";
import { caseStudyHref } from "@/lib/content/links";
import { getHome } from "@/lib/content/select";

export function FeaturedWork() {
  const { featuredWork, visible } = getHome();
  if (!visible.work) return null;
  return (
    <Reveal>
      <section id="work" className="bg-ink text-on-ink">
        <div className="mx-auto max-w-content px-2 py-8 md:px-3 md:py-14">
          <SectionHeading section="work" />
          <Stagger className="mt-4 flex flex-col gap-6 md:mt-8 md:gap-10">
            {featuredWork.map((study, index) => {
              const href = caseStudyHref(study);
              const flipped = index % 2 === 1;
              return (
                <article
                  key={study.slug}
                  data-case-study
                  className={`grid gap-3 md:grid-cols-12 md:gap-4 ${href ? "card-link" : ""}`}
                >
                  <figure className={`md:col-span-8 ${flipped ? "md:order-2" : ""}`}>
                    <div className="plate-reveal overflow-clip border border-ink-line">
                      <ResponsiveImage
                        generated={{ kind: "cover", name: `cover-${study.slug}` }}
                        image={study.image}
                        sizes="(min-width: 768px) 66vw, 100vw"
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="mt-1 font-mono text-xs text-on-ink-muted">
                      {study.title}
                    </figcaption>
                  </figure>
                  <div className="flex flex-col justify-end md:col-span-4">
                    <p className="font-mono text-xs text-on-ink-muted">{study.clientType}</p>
                    <h3 className="type-display mt-1 text-3xl">
                      {href ? (
                        <Link
                          href={href}
                          prefetch={false}
                          className="inline-flex min-h-(--size-target) items-center after:absolute after:inset-0"
                        >
                          {study.result}
                        </Link>
                      ) : (
                        study.result
                      )}
                    </h3>
                    <ul className="mt-2 flex flex-wrap gap-0.5">
                      {study.stack.map((tag) => (
                        <li
                          key={tag}
                          className="border border-ink-line px-1 py-0.5 font-mono text-xs text-on-ink-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </Stagger>
        </div>
      </section>
    </Reveal>
  );
}
