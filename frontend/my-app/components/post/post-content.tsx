import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock, SanityImage } from "@/components/post/types";
import { buildOptimizedImageUrl } from "@/lib/sanity";

type PostContentProps = {
  content?: PortableTextBlock[];
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const image = value as SanityImage;

      if (!image?.asset?._ref) {
        return null;
      }

      const imageUrl = buildOptimizedImageUrl(image, {
        width: 1200,
        fit: "max",
        quality: 72,
      });

      return (
        <figure className="my-8 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={image.alt ?? "Post image"}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 92vw, 800px"
            quality={72}
            className="h-auto w-full object-cover"
          />
        </figure>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-xl leading-9 text-slate-800">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-4 border-sky-600 bg-sky-50/70 py-3 pl-5 text-xl italic text-slate-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-3 pl-7 text-xl text-slate-800">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-7 text-xl text-slate-800">
        {children}
      </ol>
    ),
  },
};

export function PostContent({ content }: PostContentProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <PortableText value={content} components={portableTextComponents} />
    </section>
  );
}
