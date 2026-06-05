import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock, SanityImage } from "@/components/post/types";
import { urlFor } from "@/lib/sanity";

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

      const imageUrl = urlFor(image).width(1200).fit("max").url();

      return (
        <figure className="my-8 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={image.alt ?? "Post image"}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
        </figure>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-8 text-slate-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-3xl font-semibold tracking-tight text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-amber-500 pl-4 text-xl italic text-slate-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-lg text-slate-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-lg text-slate-700">
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
