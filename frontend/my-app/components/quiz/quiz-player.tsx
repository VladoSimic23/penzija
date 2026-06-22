"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Quiz } from "@/components/quiz/types";
import { buildOptimizedImageUrl, urlFor } from "@/lib/sanity";

type QuizPlayerProps = {
  quiz: Quiz;
};

type AnswersState = Record<string, string>;

function buildImageUrl(image: Quiz["coverImage"]) {
  if (!image?.asset?._ref) {
    return null;
  }

  return urlFor(image).fit("crop").url();
}

function buildImageLoader(
  image: NonNullable<Quiz["coverImage"]>,
  aspectRatio: number,
  defaultQuality: number,
) {
  return ({ width, quality }: { width: number; quality?: number }) =>
    buildOptimizedImageUrl(image, {
      width,
      height: Math.round(width / aspectRatio),
      fit: "crop",
      quality: quality ?? defaultQuality,
    });
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questionCount = quiz.questions.length;
  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter((selected) => selected.length > 0).length,
    [answers],
  );

  const score = useMemo(() => {
    return quiz.questions.reduce((total, question) => {
      const selected = answers[question._key];
      const correct = question.answers.find((answer) => answer.isCorrect)?._key;

      return selected && correct && selected === correct ? total + 1 : total;
    }, 0);
  }, [answers, quiz.questions]);

  const percentage =
    questionCount > 0 ? Math.round((score / questionCount) * 100) : 0;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= questionCount;

  function selectAnswer(questionKey: string, answerKey: string) {
    if (answers[questionKey]) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [questionKey]: answerKey,
    }));
  }

  function goToNextQuestion() {
    if (isFinished) {
      return;
    }

    setCurrentQuestionIndex((current) => Math.min(current + 1, questionCount));
  }

  function resetQuiz() {
    setAnswers({});
    setCurrentQuestionIndex(0);
  }

  return (
    <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.75)] sm:p-8">
      <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-base font-semibold text-slate-700 sm:text-lg">
          Odgovoreno: {answeredCount}/{questionCount}
        </p>
        <p className="text-base font-semibold text-sky-800 sm:text-lg">
          Točno: {score}/{questionCount} ({percentage}%)
        </p>
      </div>

      <div className="space-y-6">
        {isFinished ? (
          <article className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Kviz završen
            </p>
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Odlično odrađeno.
            </h3>
            <p className="text-base text-slate-700 sm:text-lg">
              Konačan rezultat je {score}/{questionCount} ({percentage}%).
            </p>
          </article>
        ) : (
          (() => {
            const question = currentQuestion;

            if (!question) {
              return null;
            }

            const displayAnswers = question.answers.slice(0, 4);
            const selectedAnswerKey = answers[question._key];
            const hasAnswered = Boolean(selectedAnswerKey);
            const correctAnswer = displayAnswers.find(
              (answer) => answer.isCorrect,
            );
            const selectedAnswer = displayAnswers.find(
              (answer) => answer._key === selectedAnswerKey,
            );
            const isSelectedCorrect = Boolean(
              selectedAnswer && selectedAnswer._key === correctAnswer?._key,
            );

            return (
              <article
                key={question._key}
                className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5"
              >
                <header className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                    Pitanje {currentQuestionIndex + 1}
                  </p>
                  {question.questionText ? (
                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {question.questionText}
                    </h3>
                  ) : null}
                  {hasAnswered ? (
                    <p
                      className={`text-sm font-semibold ${
                        isSelectedCorrect ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isSelectedCorrect
                        ? "Točan odgovor."
                        : "Netočan odgovor."}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 sm:text-base">
                      Odaberite jedan odgovor.
                    </p>
                  )}
                </header>

                {question.image?.asset?._ref ? (
                  <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-slate-100">
                    {(() => {
                      const questionImageUrl = buildImageUrl(question.image);
                      const questionImageLoader = buildImageLoader(
                        question.image,
                        2,
                        68,
                      );

                      return (
                        <Image
                          loader={questionImageLoader}
                          src={questionImageUrl ?? ""}
                          alt={
                            question.image.alt ??
                            question.questionText ??
                            `Pitanje ${currentQuestionIndex + 1}`
                          }
                          fill
                          quality={68}
                          sizes="(max-width: 640px) 92vw, (max-width: 1200px) 80vw, 900px"
                          className="object-cover"
                        />
                      );
                    })()}
                  </div>
                ) : null}

                <ul className="grid gap-3">
                  {displayAnswers.map((answer, answerIndex) => {
                    const isSelected = selectedAnswerKey === answer._key;
                    const isCorrect = answer.isCorrect;
                    const showCorrect = hasAnswered && isCorrect;
                    const showWrong = hasAnswered && isSelected && !isCorrect;

                    return (
                      <li key={answer._key}>
                        <button
                          type="button"
                          onClick={() =>
                            selectAnswer(question._key, answer._key)
                          }
                          disabled={hasAnswered}
                          className={`w-full rounded-xl border px-3 py-3 text-left transition sm:px-4 ${
                            showCorrect
                              ? "border-emerald-400 bg-emerald-50"
                              : showWrong
                                ? "border-rose-400 bg-rose-50"
                                : isSelected
                                  ? "border-sky-400 bg-sky-50"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                              {String.fromCharCode(65 + answerIndex)}
                            </span>
                            <div className="min-w-0 flex-1 space-y-2">
                              {answer.answerText ? (
                                <p className="text-base font-medium text-slate-800 sm:text-lg">
                                  {answer.answerText}
                                </p>
                              ) : null}

                              {answer.image?.asset?._ref ? (
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                                  {(() => {
                                    const answerImageUrl = buildImageUrl(
                                      answer.image,
                                    );
                                    const answerImageLoader = buildImageLoader(
                                      answer.image,
                                      4 / 3,
                                      68,
                                    );

                                    return (
                                      <Image
                                        loader={answerImageLoader}
                                        src={answerImageUrl ?? ""}
                                        alt={
                                          answer.image.alt ??
                                          answer.answerText ??
                                          `Odgovor ${answerIndex + 1}`
                                        }
                                        fill
                                        quality={68}
                                        sizes="(max-width: 640px) 92vw, 500px"
                                        className="object-cover"
                                      />
                                    );
                                  })()}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {hasAnswered && correctAnswer ? (
                  <p className="rounded-xl bg-sky-50 px-3 py-2 text-base font-medium text-sky-900 sm:px-4 sm:text-lg">
                    Točan odgovor:{" "}
                    {correctAnswer.answerText || "Odgovor sa slikom"}
                  </p>
                ) : null}

                {hasAnswered && question.explanation ? (
                  <p className="rounded-xl bg-slate-50 px-3 py-2 text-base text-slate-700 sm:px-4 sm:text-lg">
                    {question.explanation}
                  </p>
                ) : null}

                {hasAnswered ? (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={goToNextQuestion}
                      className="rounded-full bg-slate-900 px-5 py-2 text-base font-semibold text-white transition hover:bg-slate-800 sm:text-lg"
                    >
                      {currentQuestionIndex === questionCount - 1
                        ? "Završi kviz"
                        : "Sljedeće pitanje"}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })()
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={resetQuiz}
          className="rounded-full border border-slate-300 px-6 py-2.5 text-base font-semibold text-slate-700 transition hover:bg-slate-100 sm:text-lg"
        >
          Resetiraj kviz
        </button>
      </div>
    </section>
  );
}
