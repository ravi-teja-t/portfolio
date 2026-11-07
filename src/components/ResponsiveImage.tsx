import type { RealImage } from "@/lib/content/schemas";
import { ABOUT, COVER, GENERATED_PATH } from "../../scripts/image-sizes.mjs";

const basePath = process.env.PAGES_BASE_PATH ?? "";
const KINDS = { cover: COVER, about: ABOUT };

type Props = {
  generated: { kind: keyof typeof KINDS; name: string };
  image?: RealImage;
  sizes: string;
  className?: string;
};

// A real image replaces the generated one. Generated images use empty alt text, because their
// title or name sits next to them as real text.
export function ResponsiveImage({ generated, image, sizes, className }: Props) {
  if (image) {
    const src = `${basePath}/images/${image.src}`;
    return (
      <picture>
        <source type="image/avif" srcSet={`${src}.avif`} />
        <img
          src={`${src}.webp`}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className={className}
        />
      </picture>
    );
  }

  const { widths, ratio } = KINDS[generated.kind];
  const largest = widths[widths.length - 1];
  const file = (width: number, extension: string) =>
    `${basePath}${GENERATED_PATH}/${generated.name}-${width}.${extension}`;
  const srcSet = (extension: string) =>
    widths.map((width) => `${file(width, extension)} ${width}w`).join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={file(largest, "webp")}
        srcSet={srcSet("webp")}
        sizes={sizes}
        alt=""
        width={largest}
        height={Math.round(largest * ratio)}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
