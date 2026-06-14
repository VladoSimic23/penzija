import { FeaturedNews } from "@/components/home/featured-news";
import { LatestNewsSection } from "@/components/home/latest-news-section";
import { getLatestFeaturedPosts, getLatestPostsPage } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const featuredPosts = await getLatestFeaturedPosts(4);
  const latestNews = await getLatestPostsPage(0, 5);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-8 sm:py-10">
      {/* <section className="content-panel p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Dobro dosli
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Jasne informacije o mirovini, zakonima i pravima na jednom mjestu
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          Sadrzaj je prilagodjen laksem citanju, vecem kontrastu i jednostavnoj
          navigaciji kako biste brzo nasli ono sto vam je potrebno.
        </p>
      </section> */}

      <FeaturedNews posts={featuredPosts} />
      <LatestNewsSection
        initialPosts={latestNews.posts}
        initialHasMore={latestNews.hasMore}
      />
    </main>
  );
}
