import { sanityClient, sanityLiveClient } from "@/lib/sanity";
import type { Post } from "@/components/post/types";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && (slug.current == $slug || _id == $slug)][0]{
    _id,
    slug,
    title,
    summary,
    mainImage,
    tags,
    content,
    gallery,
    allowComments,
    poll{
      question,
      options[]{
        _key,
        label
      }
    },
    categories[]->{title}
  }`;

  return sanityClient.fetch<Post | null>(query, { slug });
}

export async function getAllPostSlugs(): Promise<string[]> {
  const query = `*[_type == "post" && defined(slug.current)].slug.current`;
  return sanityClient.fetch<string[]>(query);
}

export async function getLatestFeaturedPosts(limit = 4): Promise<Post[]> {
  const query = `*[
    _type == "post" &&
    defined(slug.current) &&
    count(categories[@->title != null && lower(@->title) == "izdvojeno"]) > 0
  ] | order(_createdAt desc)[0...$limit]{
    _id,
    slug,
    title,
    summary,
    mainImage,
    categories[]->{title}
  }`;

  return sanityClient.fetch<Post[]>(query, { limit });
}

export type PaginatedPostsResult = {
  posts: Post[];
  hasMore: boolean;
};

export async function getLatestPostsPage(
  start = 0,
  limit = 5,
  categoryTitle?: string,
): Promise<PaginatedPostsResult> {
  const safeStart = Math.max(0, Number.isFinite(start) ? Math.floor(start) : 0);
  const safeLimit = Math.min(
    20,
    Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 5),
  );
  const end = safeStart + safeLimit + 1;

  const normalizedCategory = categoryTitle?.trim();
  const categoryFilter = normalizedCategory
    ? `&& count(categories[@->title != null && lower(@->title) == lower($categoryTitle)]) > 0`
    : "";

  const query = `*[_type == "post" && defined(slug.current) ${categoryFilter}] | order(_createdAt desc)[$start...$end]{
    _id,
    slug,
    title,
    summary,
    mainImage,
    categories[]->{title}
  }`;

  const rows = await sanityLiveClient.fetch<Post[]>(query, {
    start: safeStart,
    end,
    categoryTitle: normalizedCategory,
  });

  return {
    posts: rows.slice(0, safeLimit),
    hasMore: rows.length > safeLimit,
  };
}

export async function searchPosts(
  queryText: string,
  limit = 30,
): Promise<Post[]> {
  const normalizedQuery = queryText.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const safeLimit = Math.min(
    50,
    Math.max(1, Number.isFinite(limit) ? Math.floor(limit) : 30),
  );

  const query = `*[
    _type == "post" &&
    defined(slug.current) &&
    (
      lower(title) match $pattern ||
      lower(summary) match $pattern
    )
  ] | order(_createdAt desc)[0...$limit]{
    _id,
    slug,
    title,
    summary,
    mainImage,
    categories[]->{title}
  }`;

  return sanityClient.fetch<Post[]>(query, {
    pattern: `*${normalizedQuery}*`,
    limit: safeLimit,
  });
}
