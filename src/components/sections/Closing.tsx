import { HireButton } from "@/components/HireButton";
import { Reveal } from "@/components/motion/Reveal";
import { getHome } from "@/lib/content/select";

export function Closing() {
  const { closing } = getHome();
  return (
    <Reveal>
      <section id="closing" className="mx-auto max-w-content px-2 pb-8 md:px-3 md:pb-12">
        <div className="rounded-lg bg-surface px-3 py-6 text-center md:py-10">
          <h2 className="mx-auto max-w-text text-2xl font-bold tracking-tight md:text-3xl">
            {closing.headline}
          </h2>
          <HireButton className="mt-3" />
        </div>
      </section>
    </Reveal>
  );
}
