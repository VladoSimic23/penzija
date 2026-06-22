import Image from "next/image";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { getAllQuizSlugs, getQuizBySlug } from "@/lib/quizzes";
import { buildOptimizedImageUrl, IMAGE_BLUR_PLACEHOLDER } from "@/lib/sanity";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllQuizSlugs();
  return slugs.map((slug) => ({ slug }));
}

type QuizSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function QuizSlugPage({ params }: QuizSlugPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  const coverUrl = quiz.coverImage
    ? buildOptimizedImageUrl(quiz.coverImage, {
        width: 1200,
        height: 650,
        fit: "crop",
        quality: 70,
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:space-y-10 sm:px-8 sm:py-12">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)]">
        {coverUrl ? (
          <div className="relative aspect-[16/7] w-full bg-slate-100">
            <Image
              src={coverUrl}
              alt={quiz.coverImage?.alt ?? quiz.title}
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_PLACEHOLDER}
              fill
              quality={70}
              sizes="(max-width: 768px) 92vw, 1200px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="space-y-3 px-5 py-5 sm:px-7 sm:py-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Kviz
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {quiz.title}
          </h1>
          <p className="text-base leading-8 text-slate-600 sm:text-lg">
            {quiz.description}
          </p>
          <p className="pt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Ukupno pitanja: {quiz.questions.length}
          </p>
        </div>
      </header>

      <QuizPlayer quiz={quiz} />
    </main>
  );
}
