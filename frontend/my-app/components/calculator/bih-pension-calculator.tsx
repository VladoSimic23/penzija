"use client";

import { useMemo, useState } from "react";

type Entity = "fbih" | "rs" | "brcko";
type PensionType = "starosna" | "invalidska" | "porodicna";

type BihPensionCalculatorProps = {
  slug: string;
};

type EntityConfig = {
  label: string;
  minPension: number;
  maxCoefficient: number;
  baseCoefficient: number;
  yearlyIncrease: number;
};

const ENTITY_CONFIG: Record<Entity, EntityConfig> = {
  fbih: {
    label: "FBiH",
    minPension: 599.28,
    maxCoefficient: 0.85,
    baseCoefficient: 0.45,
    yearlyIncrease: 0.015,
  },
  rs: {
    label: "RS",
    minPension: 300,
    maxCoefficient: 0.9,
    baseCoefficient: 0.4,
    yearlyIncrease: 0.017,
  },
  brcko: {
    label: "Brcko Distrikt",
    minPension: 420,
    maxCoefficient: 0.86,
    baseCoefficient: 0.43,
    yearlyIncrease: 0.016,
  },
};

const PENSION_TYPE_FACTOR: Record<PensionType, number> = {
  starosna: 1,
  invalidska: 0.9,
  porodicna: 0.75,
};

const PENSION_TYPE_LABEL: Record<PensionType, string> = {
  starosna: "Starosna",
  invalidska: "Invalidska",
  porodicna: "Porodicna",
};

function toCurrency(amount: number) {
  return new Intl.NumberFormat("bs-BA", {
    style: "currency",
    currency: "BAM",
    maximumFractionDigits: 2,
  }).format(amount);
}

function isBihCalculatorSlug(slug: string) {
  const normalizedSlug = slug.toLowerCase();
  return normalizedSlug.includes("bih") || normalizedSlug.includes("mirovin");
}

export function BihPensionCalculator({ slug }: BihPensionCalculatorProps) {
  const [entity, setEntity] = useState<Entity>("fbih");
  const [pensionType, setPensionType] = useState<PensionType>("starosna");
  const [yearsOfService, setYearsOfService] = useState<number>(30);
  const [averageSalary, setAverageSalary] = useState<number>(1400);
  const [projectedIndexation, setProjectedIndexation] = useState<number>(2.5);

  const result = useMemo(() => {
    const config = ENTITY_CONFIG[entity];
    const yearsOverMinimum = Math.max(0, yearsOfService - 15);

    const coefficient = Math.min(
      config.maxCoefficient,
      config.baseCoefficient + yearsOverMinimum * config.yearlyIncrease,
    );

    const grossEstimate =
      averageSalary * coefficient * (1 + projectedIndexation / 100);

    const adjustedEstimate = grossEstimate * PENSION_TYPE_FACTOR[pensionType];

    const finalEstimate = Math.max(config.minPension, adjustedEstimate);

    return {
      coefficient,
      grossEstimate,
      finalEstimate,
      minPension: config.minPension,
    };
  }, [averageSalary, entity, pensionType, projectedIndexation, yearsOfService]);

  const titleSlug = decodeURIComponent(slug).replace(/-/g, " ");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_22px_60px_-35px_rgba(15,23,42,0.75)] sm:p-8">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Kalkulator
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Kalkulator mirovine za stanovnike BiH
            </h1>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              Ovaj proracun je informativan i sluzi kao procjena prema entitetu,
              stazu i prosjecnoj plati. Konacni iznos zavisi od sluzbenog
              obracuna nadleznih fondova.
            </p>
            {!isBihCalculatorSlug(slug) ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 sm:text-sm">
                Trenutni URL slug je "{titleSlug}". Ova stranica trenutno
                koristi BiH model kalkulatora.
              </p>
            ) : null}
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Entitet
              </span>
              <select
                value={entity}
                onChange={(event) => setEntity(event.target.value as Entity)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
              >
                {Object.entries(ENTITY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Tip mirovine
              </span>
              <select
                value={pensionType}
                onChange={(event) =>
                  setPensionType(event.target.value as PensionType)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
              >
                {Object.entries(PENSION_TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Godine staza
              </span>
              <input
                type="number"
                min={15}
                max={45}
                value={yearsOfService}
                onChange={(event) =>
                  setYearsOfService(Number(event.target.value) || 15)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Prosjecna neto plata (BAM)
              </span>
              <input
                type="number"
                min={600}
                step={10}
                value={averageSalary}
                onChange={(event) =>
                  setAverageSalary(Number(event.target.value) || 600)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-800">
                Projekcija uskladivanja (%)
              </span>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={projectedIndexation}
                onChange={(event) =>
                  setProjectedIndexation(Number(event.target.value) || 0)
                }
                className="w-full accent-sky-600"
              />
              <p className="text-sm text-slate-600">
                {projectedIndexation.toFixed(1)}%
              </p>
            </label>
          </div>
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-[0_22px_60px_-35px_rgba(2,6,23,0.85)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Rezultat procjene
          </p>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            {toCurrency(result.finalEstimate)}
          </h2>
          <p className="text-sm leading-6 text-slate-300">
            Procijenjeni mjesecni iznos za{" "}
            {PENSION_TYPE_LABEL[pensionType].toLowerCase()} mirovinu.
          </p>

          <div className="grid gap-3 rounded-2xl bg-white/5 p-4 text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <span>Koeficijent obracuna</span>
              <strong>{result.coefficient.toFixed(3)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <span>Procjena prije minimuma</span>
              <strong>{toCurrency(result.grossEstimate)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Zakonski minimum ({ENTITY_CONFIG[entity].label})</span>
              <strong>{toCurrency(result.minPension)}</strong>
            </div>
          </div>

          <p className="rounded-xl border border-sky-400/25 bg-sky-500/10 px-3 py-2 text-xs leading-5 text-sky-100">
            Napomena: Za tacan iznos treba sluzbeni obracun PIO/MIO fonda,
            pojedinacni bodovi i potvrdeni staz po godinama.
          </p>
        </aside>
      </div>
    </section>
  );
}
