import Image from "next/image";
import Link from "next/link";
import { FeaturedNewsMobileSlider } from "./featured-news-mobile-slider";
import type { Post } from "@/components/post/types";
import { urlFor } from "@/lib/sanity";

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

  const imageUrl = urlFor(post.mainImage)
    .width(1400)
    .height(900)
    .fit("crop")
    .url();

  return (
    <Image
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      fill
      priority={priority}
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
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-26px_rgba(15,23,42,0.65)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <FeaturedImage post={post} />
      </div>
      <div className="space-y-2 px-4 py-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
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
    <section className="space-y-4 sm:space-y-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Izdvojeno
          </p>
        </div>
      </div>

      <FeaturedNewsMobileSlider posts={posts.slice(0, 4)} />

      <div className="hidden space-y-6 sm:block">
        {mainSlug ? (
          <Link
            href={`/${mainSlug}`}
            className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-38px_rgba(15,23,42,0.75)]"
          >
            <div className="relative aspect-[21/9] overflow-hidden bg-slate-100">
              <FeaturedImage post={mainPost} priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <h3 className="max-w-4xl text-2xl font-bold leading-tight text-white lg:text-3xl">
                  {mainPost.title}
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-100/95">
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
