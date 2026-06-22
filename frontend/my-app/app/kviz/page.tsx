import Image from "next/image";
import Link from "next/link";
import { getAllQuizzes } from "@/lib/quizzes";
import { buildOptimizedImageUrl, IMAGE_BLUR_PLACEHOLDER } from "@/lib/sanity";

export const revalidate = 60;

export default async function QuizListPage() {
  const quizzes = await getAllQuizzes();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:space-y-10 sm:px-8 sm:py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
          Kviz
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Testirajte znanje kroz kvizove
        </h1>
        <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          Odaberite kviz i odmah krenite. Svaki kviz moze imati neogranicen broj
          pitanja, tekstualne i slikovne odgovore te automatsku provjeru
          rezultata.
        </p>
      </header>

      {quizzes.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-base text-slate-600 sm:px-5 sm:text-lg">
          Trenutno nema objavljenih kvizova.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => {
            const slug = quiz.slug?.current;
            const coverUrl = quiz.coverImage
              ? buildOptimizedImageUrl(quiz.coverImage, {
                  width: 900,
                  height: 560,
                  fit: "crop",
                  quality: 68,
                })
              : null;

            if (!slug) {
              return null;
            }

            return (
              <Link
                key={quiz._id}
                href={`/kviz/${slug}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_-35px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 hover:border-slate-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={quiz.coverImage?.alt ?? quiz.title}
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                      fill
                      quality={68}
                      sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-base font-semibold text-slate-600 sm:text-lg">
                      Kviz bez naslovne slike
                    </div>
                  )}
                </div>

                <div className="space-y-2 px-4 py-4 sm:px-5 sm:py-5">
                  <h2 className="line-clamp-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {quiz.title}
                  </h2>
                  <p className="line-clamp-3 text-base leading-7 text-slate-600 sm:text-lg">
                    {quiz.description}
                  </p>
                  <p className="pt-1 text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
                    {quiz.questionsCount} pitanja
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
