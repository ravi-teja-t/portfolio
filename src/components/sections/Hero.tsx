import { HeroVisual } from "@/components/HeroVisual";
import { HireButton } from "@/components/HireButton";
import { HeroField } from "@/components/motion/HeroField";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getHome } from "@/lib/content/select";

// Never wrapped in Reveal: the headline and Hire button must paint immediately.
export function Hero() {
  const { hero, site, visible } = getHome();
  // Accepts "·", "•" or "|" as separators, with or without spaces, and any number of items.
  const trust = hero.trustLine
    .split(/\s*[·•|]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
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
            // Capped in height and kept at its own ratio, so a portrait or square photo can't
            // push the rest of the first screen down.
            <ResponsiveImage
              generated={{ kind: "about", name: "about" }}
              image={hero.photo}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="mx-auto h-auto max-h-[min(36rem,70vh)] w-auto max-w-full"
              eager
            />
          ) : (
            <HeroVisual />
          )}
        </div>

        {trust.length > 0 && (
          <ul className="mt-5 flex flex-col font-mono text-xs text-on-ink-muted sm:flex-row sm:flex-wrap md:mt-8">
            {trust.map((item, index) => (
              <li
                key={`${index}-${item}`}
                className="border-t border-ink-line py-1.5 sm:flex-[1_1_14rem] sm:pr-2"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div aria-hidden className="ruler text-ink-line" />
    </section>
  );
}
