import Image from "next/image";
import type { SanityImage } from "@/components/post/types";
import { buildOptimizedImageUrl } from "@/lib/sanity";

type PostGalleryProps = {
  gallery?: SanityImage[];
};

export function PostGallery({ gallery }: PostGalleryProps) {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        Galerija
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {gallery.map((image, index) => {
          if (!image?.asset?._ref) {
            return null;
          }

          const imageUrl = buildOptimizedImageUrl(image, {
            width: 900,
            height: 700,
            fit: "crop",
            quality: 70,
          });

          return (
            <figure
              key={image.asset._ref}
              className="overflow-hidden rounded-xl"
            >
              <Image
                src={imageUrl}
                alt={image.alt ?? `Gallery image ${index + 1}`}
                width={900}
                height={700}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 440px"
                quality={70}
                className="h-full w-full object-cover"
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
