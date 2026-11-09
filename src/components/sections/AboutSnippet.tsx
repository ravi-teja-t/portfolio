import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function AboutSnippet() {
  const { about, visible } = getHome();
  if (!visible.about || !about) return null;
  const [lead, ...rest] = about.sentences;
  return (
    <Reveal>
      <section
        id="about"
        className="mx-auto grid max-w-content gap-4 px-2 py-8 md:grid-cols-12 md:gap-4 md:px-3 md:py-14"
      >
        <div className="md:col-span-7">
          <SectionHeading section="about" />
          <p className="type-display mt-3 text-3xl md:mt-5">{lead}</p>
          <div className="mt-2 flex max-w-text flex-col gap-1 text-lg text-muted">
            {rest.map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
          {about.linkLabel && (
            <Link
              href="/about"
              prefetch={false}
              className="mt-2 inline-flex min-h-(--size-target) items-center font-semibold underline underline-offset-4"
            >
              {about.linkLabel}
            </Link>
          )}
        </div>
        <div className="plate-reveal overflow-clip md:col-span-4 md:col-start-9 md:self-end">
          <ResponsiveImage
            generated={{ kind: "about", name: "about" }}
            image={about.photo}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </section>
    </Reveal>
  );
}
