type Linkable = { slug: string; hasPage: boolean };

export function serviceHref(service: Linkable): string | undefined {
  return service.hasPage ? `/${service.slug}` : undefined;
}

export function caseStudyHref(caseStudy: Linkable): string | undefined {
  return caseStudy.hasPage ? `/work/${caseStudy.slug}` : undefined;
}
