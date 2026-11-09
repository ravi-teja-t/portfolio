import { HireButton } from "@/components/HireButton";
import { Reveal } from "@/components/motion/Reveal";
import { getHome } from "@/lib/content/select";

const WIDTH = 1200;
const HEIGHT = 300;
const LINE_COUNT = 9;

// Lines run in from both edges and square off into one point, which sits above the button.
function convergingLines() {
  const center = WIDTH / 2;
  return Array.from({ length: LINE_COUNT }, (_, index) => {
    const y = 20 + (index * (HEIGHT - 80)) / (LINE_COUNT - 1);
    const offset = (index - (LINE_COUNT - 1) / 2) * 12;
    const bend = 200 + index * 34;
    return [
      `M0 ${y} H${bend} V${HEIGHT - 30} H${center + offset} V${HEIGHT}`,
      `M${WIDTH} ${y} H${WIDTH - bend} V${HEIGHT - 30} H${center - offset} V${HEIGHT}`,
    ];
  }).flat();
}

export function Closing() {
  const { closing } = getHome();
  return (
    <Reveal>
      <section id="closing" className="draw-scope overflow-clip bg-ink text-on-ink">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          aria-hidden
          className="block h-auto w-full text-ink-line"
          fill="none"
          strokeWidth={1}
        >
          {convergingLines().map((d) => (
            <path key={d} d={d} pathLength={1} className="draw" />
          ))}
        </svg>
        <div className="mx-auto flex max-w-content flex-col items-center px-2 pt-4 pb-8 text-center md:px-3 md:pb-14">
          <h2 className="type-display max-w-headline text-heading">{closing.headline}</h2>
          <HireButton className="mt-4" />
        </div>
      </section>
    </Reveal>
  );
}
