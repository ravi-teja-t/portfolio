import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";
import { GENERATED_PATH, tileName } from "../../../scripts/image-sizes.mjs";

const basePath = process.env.PAGES_BASE_PATH ?? "";
const TICKER_REPEATS = 4;

function tileSrc(item: { name: string; logo?: string }) {
  return item.logo
    ? `${basePath}/images/${item.logo}`
    : `${basePath}${GENERATED_PATH}/${tileName(item.name)}.svg`;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Moves only with the scroll position, so it never runs on its own. The list below carries the
// same names for assistive technology. Built as plain markup so React hydrates one node per row
// rather than every repeated name, which keeps phone start-up under budget.
function Ticker({ names, className }: { names: string[]; className: string }) {
  const line = Array.from({ length: TICKER_REPEATS }, () => names).flat();
  const markup = line.map((name) => `<span class="px-2">${escapeHtml(name)}</span>`).join("");
  return <div className={`ticker-row ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />;
}

export function TechStack() {
  const { techStack, visible } = getHome();
  if (!visible["tech-stack"]) return null;
  const names = techStack.flatMap((group) => group.items.map((item) => item.name));
  const half = Math.ceil(names.length / 2);
  return (
    <Reveal>
      <section id="tech-stack" className="overflow-clip bg-ink text-on-ink">
        <div className="mx-auto max-w-content px-2 pt-8 md:px-3 md:pt-14">
          <SectionHeading section="techStack" />
        </div>
        <div
          aria-hidden
          data-decorative
          className="type-display mt-4 flex flex-col gap-1 text-heading text-ink-line select-none md:mt-6"
        >
          <Ticker names={names.slice(0, half)} className="ticker-left" />
          <Ticker names={names.slice(half)} className="ticker-right" />
        </div>
        <div className="mx-auto grid max-w-content gap-4 px-2 py-6 sm:grid-cols-2 md:px-3 md:py-10 lg:grid-cols-4">
          {techStack.map((group) => (
            <div key={group.group}>
              <h3 className="border-b border-on-ink pb-1 font-mono text-xs">{group.group}</h3>
              <Stagger>
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1.5 border-b border-ink-line py-1 text-sm font-medium"
                  >
                    {/* next/image can't optimise in a static export, and tiles are small SVGs */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tileSrc(item)}
                      alt=""
                      width={20}
                      height={20}
                      loading="lazy"
                      decoding="async"
                    />
                    {item.name}
                  </div>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
