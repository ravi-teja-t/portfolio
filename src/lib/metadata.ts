import type { Metadata } from "next";
import siteConfig from "../../site.config";

// Canonicals are set per page, because a root layout would pass one address to every page.
// Local test builds turn them off, because Lighthouse fails a canonical on another domain.
export function pageMetadata(pagePath: string): Metadata {
  if (process.env.SITE_CANONICAL === "off") return {};
  return { alternates: { canonical: `${siteConfig.siteUrl}${pagePath}` } };
}
