import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";
import { GENERATED_PATH, tileName } from "../../../scripts/image-sizes.mjs";

const basePath = process.env.PAGES_BASE_PATH ?? "";

function tileSrc(item: { name: string; logo?: string }) {
  return item.logo
    ? `${basePath}/images/${item.logo}`
    : `${basePath}${GENERATED_PATH}/${tileName(item.name)}.svg`;
}

export function TechStack() {
  const { techStack, visible } = getHome();
  if (!visible["tech-stack"]) return null;
  return (
    <Reveal>
      <section id="tech-stack" className="bg-surface">
        <div className="mx-auto max-w-content px-2 py-6 md:px-3 md:py-10">
          <SectionHeading section="techStack" />
          <div className="mt-3 grid gap-3 md:mt-4 md:grid-cols-2">
            {techStack.map((group) => (
              <div key={group.group}>
                <h3 className="font-mono text-xs text-muted">{group.group}</h3>
                <Stagger className="mt-1 flex flex-wrap gap-1">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1 rounded-sm border border-border bg-bg py-0.5 pr-1.5 pl-0.5 text-sm font-medium"
                    >
                      {/* next/image can't optimise in a static export, and tiles are small SVGs */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tileSrc(item)}
                        alt=""
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="rounded-sm"
                      />
                      {item.name}
                    </div>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
