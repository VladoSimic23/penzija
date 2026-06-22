import { PostContent } from "@/components/post/post-content";
import { getAllZakonSlugs, getZakonBySlug } from "@/lib/zakoni";
import { notFound } from "next/navigation";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllZakonSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ZakonSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ZakonSlugPage({ params }: ZakonSlugPageProps) {
  const { slug } = await params;
  const zakon = await getZakonBySlug(slug);

  if (!zakon) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl py-8 sm:px-8 sm:py-10">
      <article className="content-panel space-y-10 p-6 sm:p-8 lg:p-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {zakon.title}
          </h1>
          <p className="max-w-3xl text-xl leading-8 text-slate-700">
            {zakon.shortDescription}
          </p>
        </header>

        <PostContent content={zakon.content} />
      </article>
    </main>
  );
}
