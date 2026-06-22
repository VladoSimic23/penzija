import type { PortableTextBlock } from "@/components/post/types";
import { fetchSanity } from "@/lib/sanity";

export type Zakon = {
  _id: string;
  title: string;
  shortDescription: string;
  slug?: {
    current?: string;
  };
  content?: PortableTextBlock[];
};

export async function getAllZakoni(): Promise<Zakon[]> {
  const query = `*[_type == "zakon" && defined(slug.current)] | order(_createdAt desc){
    _id,
    title,
    shortDescription,
    slug
  }`;

  return fetchSanity<Zakon[]>(query);
}

export async function getAllZakonSlugs(): Promise<string[]> {
  const query = `*[_type == "zakon" && defined(slug.current)].slug.current`;
  return fetchSanity<string[]>(query);
}

export async function getZakonBySlug(slug: string): Promise<Zakon | null> {
  const query = `*[_type == "zakon" && (slug.current == $slug || _id == $slug)][0]{
    _id,
    title,
    shortDescription,
    slug,
    content
  }`;

  return fetchSanity<Zakon | null>(query, { slug });
}
