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
        className="mx-auto grid max-w-content gap-4 px-2 py-8 md:grid-cols-2 md:gap-8 md:px-3 md:py-14"
      >
        <div className="md:sticky md:top-12 md:self-start">
          <SectionHeading section="faq" />
        </div>
        <div className="divide-y divide-border border-y border-text">
          {faq.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="flex min-h-(--size-target) items-center justify-between gap-2 py-2 text-lg font-semibold">
                {item.question}
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="faq-mark size-2 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </summary>
              <p className="max-w-text pb-3 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
