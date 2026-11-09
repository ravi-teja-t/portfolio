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

// Ravi's photo. The generator makes the about photo and the favicons from it, so replacing this
// one file updates both. `face` is the square around the face, as fractions of the photo's width.
export const PORTRAIT = {
  source: "public/images/stock/ravi_formal.jpg",
  name: "portrait",
  size: 640,
  face: { left: 0.24, top: 0.075, size: 0.52 },
};
export const ICON_SIZES = [32, 192];
export const TOUCH_ICON_SIZE = 180;
