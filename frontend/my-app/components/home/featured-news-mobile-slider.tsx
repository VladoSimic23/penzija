"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Post } from "@/components/post/types";
import { buildOptimizedImageUrl, urlFor } from "@/lib/sanity";

type FeaturedNewsMobileSliderProps = {
  posts: Post[];
};

const AUTO_PLAY_MS = 6500;

function MobileSlideImage({ post }: { post: Post }) {
  if (!post.mainImage?.asset?._ref) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
        Bez slike
      </div>
    );
  }

  const mainImage = post.mainImage;
  const imageUrl = urlFor(mainImage).fit("crop").url();

  const slideImageLoader = ({
    width,
    quality,
  }: {
    width: number;
    quality?: number;
  }) =>
    buildOptimizedImageUrl(mainImage, {
      width,
      height: Math.round((width * 10) / 16),
      fit: "crop",
      quality: quality ?? 65,
    });

  return (
    <Image
      loader={slideImageLoader}
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
      quality={65}
      sizes="92vw"
      className="object-cover"
    />
  );
}

export function FeaturedNewsMobileSlider({
  posts,
}: FeaturedNewsMobileSliderProps) {
  const slides = useMemo(
    () => posts.filter((post) => typeof post.slug?.current === "string"),
    [posts],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedActiveIndex =
    slides.length > 0 ? activeIndex % slides.length : 0;

  // swipe support
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      setActiveIndex((prev) =>
        delta > 0
          ? (prev + 1) % slides.length
          : (prev - 1 + slides.length) % slides.length,
      );
    }
    touchStartX.current = null;
  }

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % slides.length);
    }, AUTO_PLAY_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="sm:hidden">
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_24px_55px_-30px_rgba(15,23,42,0.45)]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${normalizedActiveIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((post) => (
            <Link
              key={post._id}
              href={`/${post.slug!.current}`}
              className="group block w-full shrink-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <MobileSlideImage post={post} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-900/26 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="line-clamp-2 text-xl font-bold leading-7 text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-100/95">
                    {post.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((post, index) => (
            <button
              key={post._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Idi na slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                normalizedActiveIndex === index
                  ? "w-8 bg-sky-700"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
