type PostHeaderProps = {
  title: string;
  summary: string;
  tags?: string[];
  categoryTitles?: string[];
};

export function PostHeader({
  title,
  summary,
  tags,
  categoryTitles,
}: PostHeaderProps) {
  const normalizedCategories =
    categoryTitles?.filter(
      (categoryTitle) => categoryTitle.trim().length > 0,
    ) ?? [];

  return (
    <header className="space-y-6">
      {normalizedCategories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {normalizedCategories.map((categoryTitle) => (
            <span
              key={categoryTitle}
              className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900"
            >
              {categoryTitle}
            </span>
          ))}
        </div>
      ) : null}

      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {title}
      </h1>

      <p className="max-w-3xl text-xl leading-8 text-slate-600">{summary}</p>

      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </header>
  );
}
