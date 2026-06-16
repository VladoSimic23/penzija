export type PortableTextBlock = {
  _key?: string;
  _type: string;
  [key: string]: unknown;
};

export type SanityImage = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  alt?: string;
};

export type PollOption = {
  _key: string;
  label: string;
};

export type PostPoll = {
  question: string;
  options: PollOption[];
};

export type PollResultOption = {
  optionKey: string;
  label: string;
  votes: number;
  percentage: number;
};

export type PollResults = {
  totalVotes: number;
  options: PollResultOption[];
};

export type PostCategory = {
  title?: string;
};

export type Post = {
  _id: string;
  slug?: {
    current?: string;
  };
  title: string;
  summary: string;
  subtitle?: string;
  mainImage?: SanityImage;
  tags?: string[];
  content?: PortableTextBlock[];
  gallery?: SanityImage[];
  allowComments?: boolean;
  poll?: PostPoll;
  categories?: PostCategory[];
};
