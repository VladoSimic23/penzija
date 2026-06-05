export type QuizImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
};

export type QuizAnswer = {
  _key: string;
  answerText?: string;
  image?: QuizImage;
  isCorrect: boolean;
};

export type QuizQuestion = {
  _key: string;
  questionText?: string;
  image?: QuizImage;
  answers: QuizAnswer[];
  explanation?: string;
};

export type Quiz = {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
  description: string;
  coverImage?: QuizImage;
  questions: QuizQuestion[];
};

export type QuizListItem = Pick<
  Quiz,
  "_id" | "title" | "slug" | "description" | "coverImage"
> & {
  questionsCount: number;
};
