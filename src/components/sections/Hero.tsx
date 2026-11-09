import { HeroVisual } from "@/components/HeroVisual";
import { HireButton } from "@/components/HireButton";
import { HeroField } from "@/components/motion/HeroField";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getHome } from "@/lib/content/select";

// Never wrapped in Reveal: the headline and Hire button must paint immediately.
export function Hero() {
  const { hero, site, visible } = getHome();
  const trust = hero.trustLine.split(" · ");
  return (
    <section id="hero" className="relative overflow-clip bg-ink text-on-ink">
      <HeroField />
      <div className="relative mx-auto max-w-content px-2 pt-2 md:px-3 md:pt-6">
        <p className="mb-2 hidden font-mono text-xs text-on-ink-muted sm:block">{site.tagline}</p>
        <h1 className="type-display max-w-headline text-display">{hero.headline}</h1>
        <div className="mt-2 grid items-end gap-2 md:mt-4 md:grid-cols-2 md:gap-4">
          <p className="max-w-text text-base text-on-ink-muted md:text-lg">{hero.subhead}</p>
          <div className="flex flex-wrap gap-1 md:justify-end">
            <HireButton />
            {visible.work && (
              <a href="#work" className="btn-ghost">
                {hero.seeWorkLabel}
              </a>
            )}
          </div>
        </div>

        <div className="hero-plate mt-5 md:mt-8">
          {hero.photo ? (
            <ResponsiveImage
              generated={{ kind: "about", name: "about" }}
              image={hero.photo}
              sizes="100vw"
              className="h-auto w-full"
            />
          ) : (
            <HeroVisual />
          )}
        </div>

        <ul className="mt-5 grid border-t border-ink-line font-mono text-xs text-on-ink-muted sm:grid-cols-3 md:mt-8">
          {trust.map((item) => (
            <li key={item} className="border-b border-ink-line py-1.5 sm:border-b-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="ruler text-ink-line" />
    </section>
  );
}
