import Link from "next/link";
import { getAllZakoni } from "@/lib/zakoni";

export const revalidate = 60;

export default async function ZakoniPage() {
  const zakoni = await getAllZakoni();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
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
            {zakoni.map((zakon) => {
              const href = zakon.slug?.current
                ? `/zakoni/${zakon.slug.current}`
                : `/zakoni/${zakon._id}`;

              return (
                <li key={zakon._id}>
                  <Link
                    href={href}
                    className="content-panel block p-6 transition hover:-translate-y-0.5 hover:border-sky-200"
                  >
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {zakon.title}
                    </h2>
                    <p className="mt-3 text-lg leading-8 text-slate-700">
                      {zakon.shortDescription}
                    </p>
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
