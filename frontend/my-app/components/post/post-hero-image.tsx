import Image from "next/image";
import type { SanityImage } from "@/components/post/types";
import { urlFor } from "@/lib/sanity";

type PostHeroImageProps = {
  image?: SanityImage;
  title: string;
};

export function PostHeroImage({ image, title }: PostHeroImageProps) {
  if (!image?.asset?._ref) {
    return null;
  }

  const imageUrl = urlFor(image).width(1600).height(900).fit("crop").url();

  return (
    <figure className="overflow-hidden rounded-2xl">
      <Image
        src={imageUrl}
        alt={image.alt ?? title}
        width={1600}
        height={900}
        priority
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full object-cover"
      />
    </figure>
  );
}
