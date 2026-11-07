import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function AboutSnippet() {
  const { about, visible } = getHome();
  if (!visible.about || !about) return null;
  return (
    <Reveal>
      <section
        id="about"
        className="mx-auto grid max-w-content items-center gap-3 px-2 py-6 md:grid-cols-[16rem_1fr] md:gap-6 md:px-3 md:py-10"
      >
        <ResponsiveImage
          generated={{ kind: "about", name: "about" }}
          image={about.photo}
          sizes="(min-width: 768px) 256px, 160px"
          className="h-auto w-20 rounded-lg md:w-full"
        />
        <div>
          <SectionHeading section="about" />
          <div className="mt-2 flex max-w-text flex-col gap-1 text-lg text-muted">
            {about.sentences.map((sentence) => (
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
      </section>
    </Reveal>
  );
}
