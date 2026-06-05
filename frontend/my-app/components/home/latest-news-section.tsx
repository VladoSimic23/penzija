"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/components/post/types";
import { urlFor } from "@/lib/sanity";

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

  const imageUrl = urlFor(post.mainImage)
    .width(900)
    .height(640)
    .fit("crop")
    .url();

  return (
    <Image
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
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
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.65)] transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <NewsImage post={post} />
      </div>
      <div className="space-y-2 px-3 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">
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
      <section className="space-y-4 sm:space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            {headingLabel}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {headingTitle}
          </h2>
        </div>
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600">
          {emptyMessage}
        </p>
      </section>
    ) : null;
  }

  return (
    <section className="space-y-5 sm:space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          {headingLabel}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {headingTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
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
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadState === "loading" ? "Ucitavanje..." : "Ucitaj jos 5 vijesti"}
          </button>
        ) : (
          <p className="text-sm text-slate-500">
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
