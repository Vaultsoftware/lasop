
// ================================================
// File: src/app/terms/TermsClient.tsx  (CLIENT COMPONENT)
// ================================================
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type ListType = "number" | "circle";
interface Section {
  title: string;
  content?: string;
  listType?: ListType;
  items?: string[];
}
interface TermsAndConditions {
  title: string;
  sections: Section[];
}

const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

export default function TermsClient({ data }: { data: TermsAndConditions }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sections = useMemo(() => data.sections ?? [], [data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter((s) => {
      const text = `${s.title} ${s.content ?? ""} ${(s.items ?? []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });
  }, [sections, query]);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <>
      {/* Controls */}
      <section className="border-b bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-6 md:pb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow"
              >
                Print / Save PDF
              </button>
              <Share path={pathname} />
              <span className="ml-2 hidden text-xs text-gray-500 md:inline">
                Last updated: {lastUpdated}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative block w-80 max-w-full">
                <span className="sr-only">Search terms</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search (e.g., payments, attendance)"
                  className="w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
                  aria-label="Search terms"
                />
                {query && (
                  <button
                    aria-label="Clear"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border px-2 text-xs text-gray-600"
                  >
                    ×
                  </button>
                )}
              </label>

              <span className="hidden items-center gap-1 text-xs text-gray-500 md:inline-flex">
                Viewing <b>{filtered.length}</b> / <b>{sections.length}</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gradient-to-b from-white to-gray-50 print:bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[280px_1fr]">
          {/* TOC */}
          <aside className="md:sticky md:top-6 md:self-start print:hidden">
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                Table of contents
              </h2>
              <nav aria-label="Table of contents">
                <ol className="space-y-1.5 text-sm">
                  {filtered.map((s) => (
                    <li key={s.title}>
                      <a
                        href={`#${slugify(s.title)}`}
                        className="group inline-flex w-full items-start gap-2 rounded-lg px-2 py-1 hover:bg-gray-50"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                        <span className="leading-5 text-gray-700 group-hover:text-gray-900">
                          {s.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          {/* Body */}
          <article className="prose prose-neutral prose-sm max-w-none md:prose-base">
            {filtered.map((section, idx) => (
              <div
                key={section.title}
                className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-8"
              >
                <SectionBlock section={section} />
                {idx < filtered.length - 1 && (
                  <hr className="mt-6 border-dashed text-transparent" />
                )}
              </div>
            ))}

            <div className="mt-10 rounded-3xl border bg-gray-50 p-4 text-sm text-gray-600 print:border-0 print:bg-white">
              <p>
                By enrolling, attending classes, or paying any fee, you acknowledge you
                have read and agree to these Terms & Conditions. For questions, contact
                the center manager.
              </p>
              <p className="mt-2">
                This page summarizes official policy. In any conflict, signed enrollment
                documents and receipts take precedence.
              </p>
            </div>

           
          </article>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Legislation",
            name: data.title,
            url: "/terms",
            dateModified: new Date().toISOString(),
            legislationType: "TermsAndConditions",
            hasPart: (data.sections ?? []).map((s) => ({
              "@type": "WebPageElement",
              name: s.title,
              url: `/terms#${slugify(s.title)}`,
            })),
          }),
        }}
      />
    </>
  );
}

function SectionBlock({ section }: { section: Section }) {
  const id = slugify(section.title);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight">
        {section.title}
      </h2>
      {section.content && (
        <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">
          {section.content.trim()}
        </p>
      )}
      {Array.isArray(section.items) && section.items.length > 0 && (
        <List items={section.items} type={section.listType} />
      )}
    </section>
  );
}

function List({ items, type }: { items: string[]; type?: ListType }) {
  const isNumbered = type === "number";
  const Component: any = isNumbered ? "ol" : "ul";
  const listClass = isNumbered ? "list-decimal pl-6" : "list-[circle] pl-6";
  return (
    <Component className={`${listClass} mt-4 space-y-2 text-gray-700`}>
      {items.map((it, idx) => (
        <li key={idx} className="marker:text-gray-400">
          <span className="whitespace-pre-line leading-relaxed">{it.trim()}</span>
        </li>
      ))}
    </Component>
  );
}

function Share({ path }: { path: string | null }) {
  const url =
    typeof window !== "undefined"
      ? window.location.origin + (path ?? "/terms")
      : path ?? "/terms";
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch {
      alert("Copy failed; select the address bar to copy manually.");
    }
  };
  return (
    <button
      onClick={onCopy}
      className="rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow"
    >
      Copy Link
    </button>
  );
}