import { FeaturedNews } from "@/components/home/featured-news";
import { LatestNewsSection } from "@/components/home/latest-news-section";
import { getLatestFeaturedPosts, getLatestPostsPage } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const featuredPosts = await getLatestFeaturedPosts(4);
  const latestNews = await getLatestPostsPage(0, 5);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 sm:space-y-12 sm:px-8 sm:py-12">
      <FeaturedNews posts={featuredPosts} />
      <LatestNewsSection
        initialPosts={latestNews.posts}
        initialHasMore={latestNews.hasMore}
      />
    </main>
  );
}
