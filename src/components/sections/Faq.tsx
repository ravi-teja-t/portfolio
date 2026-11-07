import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getHome } from "@/lib/content/select";

export function Faq() {
  const { faq, visible } = getHome();
  if (!visible.faq) return null;
  return (
    <Reveal>
      <section
        id="faq"
        className="mx-auto grid max-w-content gap-3 px-2 py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-3 md:py-10"
      >
        <SectionHeading section="faq" />
        <div className="divide-y divide-border border-y border-border">
          {faq.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="flex min-h-(--size-target) items-center justify-between gap-2 py-1.5 font-semibold">
                {item.question}
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="faq-mark size-2 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </summary>
              <p className="pb-2 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
