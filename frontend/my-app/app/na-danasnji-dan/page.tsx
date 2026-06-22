import { LatestNewsSection } from "@/components/home/latest-news-section";
import { getLatestPostsPage } from "@/lib/posts";

export const revalidate = 60;

const CATEGORY_TITLE = "Na današnji dan";

export default async function NaDanasnjiDanPage() {
  const latestNews = await getLatestPostsPage(0, 5, CATEGORY_TITLE);

  return (
    <main className="mx-auto w-full max-w-6xl py-10 sm:px-8 sm:py-12">
      <LatestNewsSection
        initialPosts={latestNews.posts}
        initialHasMore={latestNews.hasMore}
        headingLabel={CATEGORY_TITLE}
        headingTitle="Vijesti iz kategorije Na današnji dan"
        categoryFilter={CATEGORY_TITLE}
        emptyMessage="Trenutno nema objavljenih vijesti za ovu kategoriju."
      />
    </main>
  );
}
