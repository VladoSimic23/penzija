"use client";

import Image from "next/image";
import Link from "next/link";
import { FeaturedNewsMobileSlider } from "./featured-news-mobile-slider";
import type { Post } from "@/components/post/types";
import { buildOptimizedImageUrl, urlFor } from "@/lib/sanity";

type FeaturedNewsProps = {
  posts: Post[];
};

function FeaturedImage({
  post,
  priority = false,
}: {
  post: Post;
  priority?: boolean;
}) {
  if (!post.mainImage?.asset?._ref) {
    return (
      <div className="flex h-full min-h-44 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
        Bez slike
      </div>
    );
  }

  const mainImage = post.mainImage;
  const imageUrl = urlFor(mainImage).fit("crop").url();

  const featuredImageLoader = ({
    width,
    quality,
  }: {
    width: number;
    quality?: number;
  }) =>
    buildOptimizedImageUrl(mainImage, {
      width,
      fit: "max",
      quality: quality ?? 70,
    });

  return (
    <Image
      loader={featuredImageLoader}
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
      priority={priority}
      quality={70}
      sizes="(max-width: 768px) 86vw, (max-width: 1280px) 33vw, 420px"
      className="object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  );
}

function DesktopSecondaryCard({ post }: { post: Post }) {
  const slug = post.slug?.current;

  if (!slug) {
    return null;
  }

  return (
    <Link
      href={`/${slug}`}
      className="group overflow-hidden rounded-3xl border border-sky-100 bg-white/95 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.45)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <FeaturedImage post={post} />
        {post.subtitle ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold leading-5 text-sky-800 shadow-sm">
            {post.subtitle}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 px-5 py-5">
        <h3 className="text-lg font-bold leading-7 text-slate-900">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-base leading-7 text-slate-700">
          {post.summary}
        </p>
      </div>
    </Link>
  );
}

export function FeaturedNews({ posts }: FeaturedNewsProps) {
  if (posts.length === 0) {
    return null;
  }

  const [mainPost, ...restPosts] = posts;
  const secondaryPosts = restPosts.slice(0, 3);
  const mainSlug = mainPost.slug?.current;

  return (
    <section className="content-panel space-y-5 p-5 sm:space-y-8 sm:p-8">
      {/* <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            Izdvojeno
          </p>
        </div>
      </div> */}

      <FeaturedNewsMobileSlider posts={posts.slice(0, 4)} />

      <div className="hidden space-y-6 sm:block">
        {mainSlug ? (
          <Link
            href={`/${mainSlug}`}
            className="group block overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_32px_80px_-42px_rgba(15,23,42,0.55)]"
          >
            <div className="relative aspect-[21/9] overflow-hidden bg-slate-100">
              <FeaturedImage post={mainPost} priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-900/28 to-transparent" />
              {mainPost.subtitle ? (
                <span className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold leading-5 text-sky-900 shadow-sm lg:left-8 lg:top-8">
                  {mainPost.subtitle}
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <h3 className="max-w-4xl text-2xl font-bold leading-tight text-white lg:text-[2.15rem]">
                  {mainPost.title}
                </h3>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-100/95">
                  {mainPost.summary}
                </p>
              </div>
            </div>
          </Link>
        ) : null}

        {secondaryPosts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {secondaryPosts.map((post) => (
              <DesktopSecondaryCard key={post._id} post={post} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
