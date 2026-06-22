import type { PostComment } from "@/components/comments/types";
import { fetchSanity } from "@/lib/sanity";

export async function getCommentsByPostId(
  postId: string,
): Promise<PostComment[]> {
  const query = `*[_type == "comment" && post._ref == $postId] | order(_createdAt desc){
    _id,
    name,
    message,
    _createdAt
  }`;

  return fetchSanity<PostComment[]>(query, { postId }, { preferLive: true });
}
