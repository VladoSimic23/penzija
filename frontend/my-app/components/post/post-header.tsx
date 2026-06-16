type PostHeaderProps = {
  title: string;
  tags?: string[];
  categoryTitles?: string[];
};

export function PostHeader({ title }: PostHeaderProps) {
  return (
    <header className="space-y-7">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
    </header>
  );
}
