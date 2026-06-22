"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/components/post/types";
import { buildOptimizedImageUrl, urlFor } from "@/lib/sanity";

type LatestNewsSectionProps = {
  initialPosts: Post[];
  initialHasMore: boolean;
  headingLabel?: string;
  headingTitle?: string;
  categoryFilter?: string;
  emptyMessage?: string;
};

type LoadState = "idle" | "loading" | "error";

const PAGE_SIZE = 5;

function NewsImage({ post }: { post: Post }) {
  if (!post.mainImage?.asset?._ref) {
    return (
      <div className="flex h-full min-h-24 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-slate-500">
        Bez slike
      </div>
    );
  }

  const mainImage = post.mainImage;
  const imageUrl = urlFor(mainImage).fit("crop").url();

  const newsImageLoader = ({
    width,
    quality,
  }: {
    width: number;
    quality?: number;
  }) =>
    buildOptimizedImageUrl(mainImage, {
      width,
      height: Math.round((width * 9) / 16),
      fit: "crop",
      quality: quality ?? 68,
    });

  return (
    <Image
      loader={newsImageLoader}
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
      quality={68}
      sizes="(max-width: 640px) 92vw, (max-width: 1280px) 20vw, 240px"
      className="object-cover"
    />
  );
}

function NewsCard({ post }: { post: Post }) {
  const slug = post.slug?.current;

  if (!slug) {
    return null;
  }

  return (
    <Link
      href={`/${slug}`}
      className="group overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_22px_60px_-30px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:border-sky-200"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <NewsImage post={post} />
        {post.subtitle ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-sm font-bold leading-5 text-sky-800 shadow-sm">
            {post.subtitle}
          </span>
        ) : null}
      </div>
      <div className="space-y-1.5 px-4 py-3.5">
        <h3 className="text-2xl font-bold leading-8 text-slate-900">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-base leading-7 text-slate-700">
          {post.summary}
        </p>
      </div>
    </Link>
  );
}

export function LatestNewsSection({
  initialPosts,
  initialHasMore,
  headingLabel = "Najnovije",
  headingTitle = "Posljednje vijesti",
  categoryFilter,
  emptyMessage,
}: LatestNewsSectionProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLoadMore() {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const query = new URLSearchParams({
        start: String(posts.length),
        limit: String(PAGE_SIZE),
      });

      if (categoryFilter) {
        query.set("category", categoryFilter);
      }

      const response = await fetch(`/api/latest-posts?${query.toString()}`);
      const payload = (await response.json()) as {
        posts?: Post[];
        hasMore?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.posts) {
        throw new Error(payload.error || "Neuspjelo ucitavanje vijesti.");
      }

      setPosts((current) => [...current, ...payload.posts!]);
      setHasMore(Boolean(payload.hasMore));
      setLoadState("idle");
    } catch (error) {
      setLoadState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Dogodila se greska.",
      );
    }
  }

  if (posts.length === 0) {
    return emptyMessage ? (
      <section className="content-panel space-y-4 p-5 sm:space-y-5 sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            {headingLabel}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {headingTitle}
          </h2>
        </div>
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-base text-slate-700">
          {emptyMessage}
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="content-panel space-y-5 p-5 sm:space-y-7 sm:p-7">
      <div>
        {/* <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          {headingLabel}
        </p> */}
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {headingTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {posts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        {hasMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadState === "loading"}
            className="rounded-full bg-sky-800 px-7 py-3 text-base font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadState === "loading" ? "Ucitavanje..." : "Ucitaj jos 5 vijesti"}
          </button>
        ) : (
          <p className="text-base text-slate-500">
            Nema vise vijesti za ucitavanje.
          </p>
        )}

        {loadState === "error" && errorMessage ? (
          <p className="text-sm text-red-700">{errorMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
