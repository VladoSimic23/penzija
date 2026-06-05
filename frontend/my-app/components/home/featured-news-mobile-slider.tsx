"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/components/post/types";
import { urlFor } from "@/lib/sanity";

type FeaturedNewsMobileSliderProps = {
  posts: Post[];
};

const AUTO_PLAY_MS = 4500;

function MobileSlideImage({ post }: { post: Post }) {
  if (!post.mainImage?.asset?._ref) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
        Bez slike
      </div>
    );
  }

  const imageUrl = urlFor(post.mainImage)
    .width(1200)
    .height(760)
    .fit("crop")
    .url();

  return (
    <Image
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
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

  const goToPrevious = () => {
    setActiveIndex((previous) =>
      previous === 0 ? slides.length - 1 : previous - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((previous) => (previous + 1) % slides.length);
  };

  return (
    <div className="sm:hidden">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)]">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${normalizedActiveIndex * 100}%)` }}
        >
          {slides.map((post) => (
            <Link
              key={post._id}
              href={`/${post.slug!.current}`}
              className="group block w-full shrink-0"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <MobileSlideImage post={post} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="line-clamp-2 text-base font-semibold leading-5 text-white">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-100/95">
                    {post.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Prethodna vijest"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/60"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Sljedeca vijest"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/60"
            >
              →
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((post, index) => (
            <button
              key={post._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Idi na slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                normalizedActiveIndex === index
                  ? "w-6 bg-slate-900"
                  : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
