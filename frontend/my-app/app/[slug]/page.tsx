import { CommentsSection } from "@/components/comments/comments-section";
import { PostContent } from "@/components/post/post-content";
import { PostGallery } from "@/components/post/post-gallery";
import { PostHeader } from "@/components/post/post-header";
import { PostHeroImage } from "@/components/post/post-hero-image";
import { PostPollSection } from "@/components/post/post-poll-section";
import { getCommentsByPostId } from "@/lib/comments";
import { getPollResultsByPostId } from "@/lib/poll";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

type SlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(post._id);
  const pollOptions = post.poll?.options ?? [];
  const pollResults = await getPollResultsByPostId(post._id, pollOptions);
  const categoryTitles = (post.categories ?? [])
    .map((category) => category.title?.trim() ?? "")
    .filter((title) => title.length > 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <article className="content-panel space-y-10 p-6 sm:p-8 lg:p-10">
        <PostHeader
          title={post.title}
          tags={post.tags}
          categoryTitles={categoryTitles}
        />
        <PostHeroImage image={post.mainImage} title={post.title} />
        <PostContent content={post.content} />
        <PostGallery gallery={post.gallery} />
        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-base text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        {post.poll?.question && post.poll.options?.length >= 2 ? (
          <PostPollSection
            postId={post._id}
            poll={post.poll}
            initialResults={pollResults}
          />
        ) : null}
        {post.allowComments !== false && (
          <CommentsSection postId={post._id} initialComments={comments} />
        )}
      </article>
    </main>
  );
}
