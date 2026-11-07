import { HeroVisual } from "@/components/HeroVisual";
import { HireButton } from "@/components/HireButton";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getHome } from "@/lib/content/select";

// Never wrapped in Reveal: the headline and Hire button must paint immediately.
export function Hero() {
  const { hero, visible } = getHome();
  return (
    <section id="hero" className="mx-auto max-w-content px-2 pt-3 pb-6 md:px-3 md:pt-10 md:pb-12">
      <div className="grid items-center gap-5 md:grid-cols-[1.15fr_0.85fr] md:gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{hero.headline}</h1>
          <p className="mt-2 max-w-text text-base text-muted md:mt-3 md:text-lg">{hero.subhead}</p>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row md:mt-4">
            <HireButton />
            {visible.work && (
              <a
                href="#work"
                className="inline-flex min-h-(--size-target) items-center justify-center rounded-sm border border-border px-2 font-semibold transition-colors duration-200 hover:bg-surface"
              >
                {hero.seeWorkLabel}
              </a>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">{hero.trustLine}</p>
        </div>
        {hero.photo ? (
          <ResponsiveImage
            generated={{ kind: "about", name: "about" }}
            image={hero.photo}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="h-auto w-full rounded-lg"
          />
        ) : (
          <HeroVisual />
        )}
      </div>
    </section>
  );
}
