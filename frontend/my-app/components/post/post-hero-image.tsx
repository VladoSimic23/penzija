import Image from "next/image";
import type { SanityImage } from "@/components/post/types";
import { buildOptimizedImageUrl, IMAGE_BLUR_PLACEHOLDER } from "@/lib/sanity";

type PostHeroImageProps = {
  image?: SanityImage;
  title: string;
};

export function PostHeroImage({ image, title }: PostHeroImageProps) {
  if (!image?.asset?._ref) {
    return null;
  }

  const imageUrl = buildOptimizedImageUrl(image, {
    width: 1600,
    height: 900,
    fit: "crop",
    quality: 72,
  });

  return (
    <figure className="overflow-hidden rounded-2xl">
      <Image
        src={imageUrl}
        alt={image.alt ?? title}
        placeholder="blur"
        blurDataURL={IMAGE_BLUR_PLACEHOLDER}
        width={1600}
        height={900}
        sizes="(max-width: 768px) 92vw, (max-width: 1280px) 85vw, 1200px"
        quality={72}
        priority
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full object-cover"
      />
    </figure>
  );
}
