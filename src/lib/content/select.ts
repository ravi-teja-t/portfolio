import { loadContent } from "./load";

const MAX_METRICS = 4;
const MAX_TESTIMONIALS = 3;
const FEATURED_COUNT = 3;

function byOrder<T extends { order?: number }>(a: T, b: T) {
  return (a.order ?? 0) - (b.order ?? 0);
}

function selectHome() {
  const content = loadContent();

  const metrics = content.metrics.filter((metric) => metric.approved);
  if (metrics.length > MAX_METRICS) {
    throw new Error(`Invalid content in home/metrics.yaml: more than ${MAX_METRICS} approved`);
  }

  const testimonials = content.testimonials.filter((item) => item.approved).sort(byOrder);
  if (testimonials.length > MAX_TESTIMONIALS) {
    throw new Error(`Invalid content in testimonials: more than ${MAX_TESTIMONIALS} approved`);
  }

  const services = [...content.services].sort(byOrder);
  const featuredWork = content.caseStudies
    .filter((study) => study.listed)
    .sort(byOrder)
    .slice(0, FEATURED_COUNT);
  const techStack = content.techStack.filter((group) => group.items.length > 0);

  const visible: Record<string, boolean> = {
    proof: metrics.length > 0,
    services: services.length > 0,
    work: featuredWork.length > 0,
    "how-i-work": content.howIWork.length > 0,
    "tech-stack": techStack.length > 0,
    about: content.about !== undefined,
    testimonials: testimonials.length > 0,
    faq: content.faq.length > 0,
  };

  const nav = content.site.nav.filter((link) => {
    const section = link.href.split("#")[1];
    return section === undefined || visible[section] !== false;
  });

  return { ...content, metrics, testimonials, services, featuredWork, techStack, visible, nav };
}

let cached: ReturnType<typeof selectHome> | undefined;

export function getHome() {
  cached ??= selectHome();
  return cached;
}
