import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { z } from "zod";
import rawSiteConfig from "../../../site.config";
import {
  aboutSchema,
  caseStudySchema,
  closingSchema,
  faqSchema,
  heroSchema,
  howIWorkSchema,
  metricsSchema,
  notFoundSchema,
  sectionsSchema,
  serviceSchema,
  siteConfigSchema,
  techStackSchema,
  testimonialSchema,
} from "./schemas";

const contentDir = path.resolve(process.cwd(), process.env.CONTENT_DIR ?? "content");
const imagesDir = path.resolve(process.cwd(), "public/images");

function validate<S extends z.ZodType>(schema: S, value: unknown, file: string): z.output<S> {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const problems = result.error.issues
    .map((issue) => `${issue.path.join(".") || "(file)"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid content in ${file}: ${problems}`);
}

function findPlaceholder(value: unknown): string | undefined {
  if (typeof value === "string") {
    const prose = value.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
    return (
      prose.match(/\[[^\]\n]+\](?!\()/)?.[0] ?? prose.match(/\b(?:TODO|TBD)\b|lorem ipsum/i)?.[0]
    );
  }
  if (Array.isArray(value)) return value.map(findPlaceholder).find(Boolean);
  if (value && typeof value === "object") {
    return Object.values(value).map(findPlaceholder).find(Boolean);
  }
  return undefined;
}

function rejectPlaceholders(value: unknown, file: string) {
  if (process.env.NODE_ENV !== "production") return;
  const placeholder = findPlaceholder(value);
  if (placeholder) throw new Error(`Placeholder "${placeholder}" in ${file}`);
}

function readYaml(relative: string): unknown {
  const file = path.join(contentDir, relative);
  if (!fs.existsSync(file)) return undefined;
  const value: unknown = parse(fs.readFileSync(file, "utf8"));
  rejectPlaceholders(value, relative);
  return value;
}

function required<S extends z.ZodType>(relative: string, schema: S): z.output<S> {
  const value = readYaml(relative);
  if (value === undefined) throw new Error(`Missing required content file: ${relative}`);
  return validate(schema, value, relative);
}

function optional<S extends z.ZodType>(relative: string, schema: S): z.output<S> | undefined {
  const value = readYaml(relative);
  return value === undefined || value === null ? undefined : validate(schema, value, relative);
}

function listFiles(folder: string, extension: string): string[] {
  const directory = path.join(contentDir, folder);
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(extension))
    .sort()
    .map((name) => `${folder}/${name}`);
}

function readFrontmatter(relative: string): unknown {
  const raw = fs.readFileSync(path.join(contentDir, relative), "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid content in ${relative}: missing frontmatter`);
  const frontmatter: unknown = parse(match[1]);
  rejectPlaceholders([frontmatter, match[2]], relative);
  return frontmatter;
}

function requireUnique(items: { slug: string }[], folder: string) {
  const seen = new Set<string>();
  for (const { slug } of items) {
    if (seen.has(slug)) throw new Error(`Invalid content in ${folder}: duplicate slug ${slug}`);
    seen.add(slug);
  }
}

function requireRealImage(image: { src: string } | undefined, file: string) {
  if (!image) return;
  for (const extension of ["avif", "webp"]) {
    if (!fs.existsSync(path.join(imagesDir, `${image.src}.${extension}`))) {
      throw new Error(`Invalid content in ${file}: missing image ${image.src}.${extension}`);
    }
  }
}

function load() {
  const site = validate(siteConfigSchema, rawSiteConfig, "site.config.ts");
  rejectPlaceholders(site, "site.config.ts");

  const hero = required("home/hero.yaml", heroSchema);
  const closing = required("home/closing.yaml", closingSchema);
  const notFound = required("home/not-found.yaml", notFoundSchema);
  const sections = required("home/sections.yaml", sectionsSchema);
  const metrics = optional("home/metrics.yaml", metricsSchema) ?? [];
  const howIWork = optional("home/how-i-work.yaml", howIWorkSchema) ?? [];
  const techStack = optional("home/tech-stack.yaml", techStackSchema) ?? [];
  const about = optional("home/about.yaml", aboutSchema);
  const faq = optional("home/faq.yaml", faqSchema) ?? [];

  const testimonials = listFiles("testimonials", ".yaml").map((file) =>
    validate(testimonialSchema, readYaml(file), file),
  );
  const services = listFiles("services", ".mdx").map((file) =>
    validate(serviceSchema, readFrontmatter(file), file),
  );
  const caseStudies = listFiles("case-studies", ".mdx").map((file) =>
    validate(caseStudySchema, readFrontmatter(file), file),
  );

  requireUnique(services, "services");
  requireUnique(caseStudies, "case-studies");
  requireRealImage(hero.photo, "home/hero.yaml");
  requireRealImage(about?.photo, "home/about.yaml");
  caseStudies.forEach((study) => requireRealImage(study.image, `case-studies/${study.slug}.mdx`));
  for (const group of techStack) {
    for (const item of group.items) {
      if (item.logo && !fs.existsSync(path.join(imagesDir, item.logo))) {
        throw new Error(`Invalid content in home/tech-stack.yaml: missing logo ${item.logo}`);
      }
    }
  }

  return {
    site,
    hero,
    closing,
    notFound,
    sections,
    metrics,
    howIWork,
    techStack,
    about,
    faq,
    testimonials,
    services,
    caseStudies,
  };
}

let cached: ReturnType<typeof load> | undefined;

export function loadContent() {
  cached ??= load();
  return cached;
}
