import type { Quiz, QuizListItem } from "@/components/quiz/types";
import { fetchSanity } from "@/lib/sanity";

export async function getAllQuizSlugs(): Promise<string[]> {
  const query = `*[_type == "quiz" && defined(slug.current)].slug.current`;
  return fetchSanity<string[]>(query);
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  const query = `*[_type == "quiz" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    coverImage,
    questions[]{
      _key,
      questionText,
      image,
      explanation,
      answers[]{
        _key,
        answerText,
        image,
        isCorrect
      }
    }
  }`;

  return fetchSanity<Quiz | null>(query, { slug });
}

export async function getAllQuizzes(): Promise<QuizListItem[]> {
  const query = `*[_type == "quiz" && defined(slug.current)] | order(_createdAt desc){
    _id,
    title,
    slug,
    description,
    coverImage,
    "questionsCount": count(questions)
  }`;

  return fetchSanity<QuizListItem[]>(query, undefined, { preferLive: true });
}
