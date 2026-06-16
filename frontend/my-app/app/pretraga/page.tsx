import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/components/post/types";
import { searchPosts } from "@/lib/posts";
import { buildOptimizedImageUrl, IMAGE_BLUR_PLACEHOLDER } from "@/lib/sanity";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function SearchResultImage({ post }: { post: Post }) {
  if (!post.mainImage?.asset?._ref) {
    return (
      <div className="flex h-full min-h-24 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-slate-500">
        Bez slike
      </div>
    );
  }

  const mainImage = post.mainImage;
  const imageUrl = buildOptimizedImageUrl(mainImage, {
    width: 900,
    height: Math.round((900 * 3) / 4),
    fit: "crop",
    quality: 68,
  });

  return (
    <Image
      src={imageUrl}
      alt={post.mainImage.alt ?? post.title}
      placeholder="blur"
      blurDataURL={IMAGE_BLUR_PLACEHOLDER}
      fill
      quality={68}
      sizes="(max-width: 768px) 92vw, 220px"
      className="object-cover"
    />
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const posts = query ? await searchPosts(query, 40) : [];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-8 sm:px-8 sm:py-10">
      <header className="content-panel space-y-3 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Pretraga
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Rezultati pretrage vijesti
        </h1>
        {query ? (
          <p className="text-base text-slate-700 sm:text-lg">
            Upit: <span className="font-semibold text-slate-900">{query}</span>
          </p>
        ) : (
          <p className="text-base text-slate-700 sm:text-lg">
            Unesite pojam u search unutar navbara.
          </p>
        )}
      </header>

      {query && posts.length === 0 ? (
        <p className="content-panel px-5 py-6 text-base text-slate-700">
          Nema vijesti za uneseni pojam.
        </p>
      ) : null}

      {posts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const slug = post.slug?.current;

            if (!slug) {
              return null;
            }

            return (
              <li key={post._id}>
                <Link
                  href={`/${slug}`}
                  className="group block overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_22px_60px_-30px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:border-sky-200"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <SearchResultImage post={post} />
                    {post.subtitle ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold leading-5 text-sky-800 shadow-sm">
                        {post.subtitle}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1.5 px-4 py-3.5">
                    <h2 className="text-xl font-bold leading-7 text-slate-900">
                      {post.title}
                    </h2>
                    <p className="line-clamp-1 text-sm leading-6 text-slate-700">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </main>
  );
}
