import { z } from "zod";

const text = z.string().trim().min(1);

const upworkUrl = z.url().refine(
  (value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["www.upwork.com", "upwork.com"].includes(url.hostname) &&
      url.pathname.startsWith("/freelancers/~")
    );
  },
  { message: "must be https, on upwork.com, with a path starting /freelancers/~" },
);

export const siteConfigSchema = z.object({
  upworkUrl,
  siteUrl: z.url(),
  name: text,
  tagline: text,
  nav: z.array(z.object({ label: text, href: text })).min(1),
  hireLabel: text,
  menuLabel: text,
  skipLabel: text,
  footerLine: text,
});

export const realImageSchema = z.object({
  src: text,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const heroSchema = z.object({
  headline: text,
  subhead: text,
  seeWorkLabel: text,
  trustLine: text,
  photo: realImageSchema.optional(),
});

export const metricSchema = z.object({
  value: text,
  label: text,
  approved: z.boolean(),
});
export const metricsSchema = z.array(metricSchema);

export const howIWorkSchema = z.array(z.object({ title: text, text }));

export const techStackSchema = z.array(
  z.object({
    group: z.enum(["AI", "Backend", "Cloud and DevOps", "Healthcare"]),
    items: z.array(z.object({ name: text, logo: text.optional() })),
  }),
);

export const aboutSchema = z.object({
  sentences: z.array(text).length(3),
  photo: realImageSchema.optional(),
  linkLabel: text.optional(),
});

export const faqSchema = z.array(z.object({ question: text, answer: text }));

export const closingSchema = z.object({ headline: text });

export const notFoundSchema = z.object({ heading: text, text, homeLabel: text });

export const sectionsSchema = z.object({
  proof: text,
  services: text,
  work: text,
  howIWork: text,
  techStack: text,
  about: text,
  testimonials: text,
  faq: text,
});

export const testimonialSchema = z.object({
  quote: text,
  approved: z.boolean(),
  name: text.optional(),
  role: text.optional(),
  company: text.optional(),
  order: z.number().optional(),
});

export const serviceSchema = z.object({
  slug: text.refine((slug) => !["work", "about", "services"].includes(slug), {
    message: "must not clash with work, about or services",
  }),
  title: text,
  order: z.number(),
  outcomeHeadline: text,
  oneLine: text,
  deliverables: z.array(text).length(3),
  hasPage: z.boolean().default(false),
});

export const caseStudySchema = z.object({
  slug: text,
  title: text,
  order: z.number(),
  listed: z.boolean(),
  clientType: text,
  result: text,
  stack: z.array(text).min(1),
  image: realImageSchema.optional(),
  // Labels for the generated cover diagram. Read by scripts/generate-images.mjs.
  diagram: z
    .object({
      inputs: z.array(text).min(1).max(5),
      core: text,
      steps: z.array(text).min(1).max(5),
      tools: z.array(text).min(1).max(5),
      outputs: z.array(text).min(1).max(3),
    })
    .optional(),
  hasPage: z.boolean().default(false),
});

export type RealImage = z.infer<typeof realImageSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Step = z.infer<typeof howIWorkSchema>[number];
export type TechGroup = z.infer<typeof techStackSchema>[number];
export type About = z.infer<typeof aboutSchema>;
export type FaqItem = z.infer<typeof faqSchema>[number];
export type Closing = z.infer<typeof closingSchema>;
export type NotFound = z.infer<typeof notFoundSchema>;
export type Sections = z.infer<typeof sectionsSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
