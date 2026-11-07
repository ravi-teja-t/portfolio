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
  const columns = featuredWork.length === 1 ? "" : "md:grid-cols-3";
  return (
    <Reveal>
      <section id="work" className="bg-surface">
        <div className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-10">
          <SectionHeading section="work" />
          <Stagger className={`mt-3 grid gap-2 md:mt-4 ${columns}`}>
            {featuredWork.map((study) => {
              const href = caseStudyHref(study);
              return (
                <article
                  key={study.slug}
                  data-case-study
                  className={`grid h-full overflow-hidden rounded-md border border-border bg-bg ${
                    href ? "card-link" : ""
                  } ${featuredWork.length === 1 ? "md:grid-cols-2" : ""}`}
                >
                  <ResponsiveImage
                    generated={{ kind: "cover", name: `cover-${study.slug}` }}
                    image={study.image}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                  <div className="flex flex-col justify-center p-3">
                    <p className="font-mono text-xs text-muted">{study.clientType}</p>
                    <h3 className="mt-1 text-lg font-bold tracking-tight">
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
                          className="rounded-sm bg-surface px-1 py-0.5 font-mono text-xs text-muted"
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
