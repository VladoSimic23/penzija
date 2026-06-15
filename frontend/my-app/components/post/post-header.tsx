type PostHeaderProps = {
  title: string;
  summary: string;
  tags?: string[];
  categoryTitles?: string[];
};

export function PostHeader({ title, summary }: PostHeaderProps) {
  return (
    <header className="space-y-7">
      <p className="soft-chip max-w-3xl text-xl leading-9 text-slate-700 inline-flex items-center px-3">
        {summary}
      </p>

      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
    </header>
  );
}
