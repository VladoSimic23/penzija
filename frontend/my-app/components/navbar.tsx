"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Novosti" },
  { href: "/kalkulator", label: "Kalkulator mirovina" },
  { href: "/medjunarodne-mirovine", label: "Međunarodne mirovine" },
  { href: "/na-danasnji-dan", label: "Na današnji dan" },
  { href: "/zakoni", label: "Zakoni" },
  { href: "/kviz", label: "Zabava" },
  // { href: "/", label: "Kontakt" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-4">
        <Link
          href="/"
          className="rounded-xl px-2 py-1 text-xl font-bold tracking-tight text-slate-900 hover:bg-sky-50 sm:text-[1.9rem]"
        >
          Penzija.ba
        </Link>

        <form
          action="/pretraga"
          method="get"
          className="mx-2 hidden flex-1 lg:block"
        >
          <div className="relative mx-auto w-full max-w-md">
            <input
              type="search"
              name="q"
              placeholder="Pretrazi vijesti..."
              className="w-full rounded-full border border-sky-200 bg-slate-50 py-3 pl-5 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="submit"
              aria-label="Pretrazi"
              className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-sky-800 text-white hover:bg-sky-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8.5 3a5.5 5.5 0 104.27 8.97l3.63 3.63a.75.75 0 101.06-1.06l-3.63-3.63A5.5 5.5 0 008.5 3zM4.5 8.5a4 4 0 118 0 4 4 0 01-8 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white p-2.5 text-slate-700 hover:bg-sky-50 md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>

        <ul className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`rounded-full px-4 py-2 text-base font-semibold transition ${
                  pathname === link.href
                    ? "bg-sky-100 text-sky-900"
                    : "text-slate-700 hover:bg-sky-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-sky-100 bg-white px-4 pb-4 md:hidden"
        >
          <form action="/pretraga" method="get" className="pt-3">
            <div className="relative">
              <input
                type="search"
                name="q"
                placeholder="Pretrazi vijesti..."
                className="w-full rounded-full border border-sky-200 bg-slate-50 py-3 pl-5 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="submit"
                aria-label="Pretrazi"
                className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-sky-800 text-white hover:bg-sky-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.5 3a5.5 5.5 0 104.27 8.97l3.63 3.63a.75.75 0 101.06-1.06l-3.63-3.63A5.5 5.5 0 008.5 3zM4.5 8.5a4 4 0 118 0 4 4 0 01-8 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>

          <ul className="flex flex-col gap-1.5 pt-3">
            {navLinks.map((link) => (
              <li key={`mobile-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-semibold transition ${
                    pathname === link.href
                      ? "bg-sky-100 text-sky-900"
                      : "text-slate-700 hover:bg-sky-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
