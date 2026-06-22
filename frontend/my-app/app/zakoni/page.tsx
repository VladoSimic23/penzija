import Link from "next/link";
import { getAllZakoni } from "@/lib/zakoni";

export const revalidate = 60;

export default async function ZakoniPage() {
  const zakoni = await getAllZakoni();

  return (
    <main className="mx-auto w-full max-w-6xl py-8 sm:px-8 sm:py-10">
      <section className="space-y-7">
        <header className="content-panel space-y-3 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            Baza propisa
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Zakoni
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-700">
            Jednostavan pregled svih objavljenih zakona i sluzbenih tumacenja.
          </p>
        </header>

        {zakoni.length === 0 ? (
          <p className="content-panel border-dashed p-6 text-base text-slate-700">
            Trenutno nema objavljenih zakona.
          </p>
        ) : (
          <ul className="space-y-4">
            {zakoni.map((zakon, index) => {
              const href = zakon.slug?.current
                ? `/zakoni/${zakon.slug.current}`
                : `/zakoni/${zakon._id}`;

              return (
                <li key={zakon._id}>
                  <Link
                    href={href}
                    className="content-panel flex items-start gap-5 p-6 transition hover:-translate-y-0.5 hover:border-sky-200"
                  >
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                      {index + 1}
                    </span>
                    <div className="flex flex-1 flex-col gap-1">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {zakon.title}
                      </h2>
                      <p className="mt-2 text-lg leading-8 text-slate-700">
                        {zakon.shortDescription}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                        Saznaj više
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
