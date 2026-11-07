// Shared by the generator and ResponsiveImage, so names and sizes have one source.
export const GENERATED_PATH = "/images/generated";

export const COVER = { widths: [640, 1280], ratio: 9 / 16 };
export const ABOUT = { widths: [320, 640], ratio: 1 };

export function tileName(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `tile-${slug}`;
}
