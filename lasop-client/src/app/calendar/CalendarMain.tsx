// File: src/components/calendar/CalendarMain.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

type ObjectIdLike = string;

interface Course { _id: ObjectIdLike; title?: string; name?: string; }
interface Center { _id: ObjectIdLike; name?: string; }
interface Cohort {
  _id: ObjectIdLike;
  cohortName: string;
  courseId: Course[];         // populated
  startDate: string;          // ISO
  endDate: string;            // ISO
  center: Center[];           // populated
  mode: string[];             // ["Weekday","Weekend","Online",...]
  isActive: boolean;
  status: "completed" | "current" | "inactive";
  createdAt?: string;         // from timestamps: true
}

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const getCourseTitle = (c: Course) => c.title ?? c.name ?? "Untitled Course";

export default function CalendarMain() {
  const [data, setData] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1); // 1-based

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/cohort`, { cache: "no-store", signal: ctrl.signal });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`GET /api/cohort failed: ${res.status} ${t}`);
        }
        const json = (await res.json()) as Cohort[];
        setData(Array.isArray(json) ? json : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Failed to load cohorts");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // Sort cohorts once
  const sortedCohorts = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const aStart = new Date(a.startDate).getTime();
      const bStart = new Date(b.startDate).getTime();
      if (bStart !== aStart) return bStart - aStart;
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bCreated - aCreated;
    });
    return arr;
  }, [data]);

  const totalCohorts = sortedCohorts.length;
  const totalPages = Math.max(1, Math.ceil(totalCohorts / PAGE_SIZE));

  // Clamp page when total changes
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1 && totalPages >= 1) setPage(1);
  }, [page, totalPages]);

  // Slice exactly 10 cohorts per page
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalCohorts);
  const pageCohorts = sortedCohorts.slice(startIndex, endIndex);

  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const Pager = () => {
    if (totalPages <= 1) return null;
    const btnBase =
      "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition";
    const inactive = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
    const active = "border-accent bg-accent text-white hover:bg-accent/90";
    const disabled = "opacity-50 cursor-not-allowed";

    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{totalCohorts === 0 ? 0 : startIndex + 1}</span>–
          <span className="font-semibold">{endIndex}</span> of{" "}
          <span className="font-semibold">{totalCohorts}</span> cohorts
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`${btnBase} ${inactive} ${page === 1 ? disabled : ""}`}
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            Prev
          </button>

          {numbers.map((n) => (
            <button
              type="button"
              key={n}
              className={`${btnBase} ${n === page ? active : inactive}`}
              onClick={() => goToPage(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            className={`${btnBase} ${inactive} ${page === totalPages ? disabled : ""}`}
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="calendar_main w-full bg-[#DAE2FF] px-6 py-10 md:px-12">
      <div className="mx-auto max-w-6xl overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg">
        {loading && <div className="p-6 text-sm text-gray-600">Loading cohorts…</div>}
        {!loading && err && <div className="p-6 text-sm text-red-600">{err}</div>}
        {!loading && !err && totalCohorts === 0 && (
          <div className="p-6 text-sm text-gray-600">No cohorts available.</div>
        )}

        {!loading && !err && totalCohorts > 0 && (
          <>
            <table className="min-w-full overflow-hidden rounded-lg">
              <thead className="bg-accent text-white">
                <tr>
                  <th className="border-r border-white/20 px-6 py-4 text-left text-base font-bold">Cohorts</th>
                  <th className="border-r border-white/20 px-6 py-4 text-left text-base font-bold">Start Date</th>
                  <th className="px-6 py-4 text-left text-base font-bold">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {pageCohorts.map((coh) => {
                  const start = formatDate(coh.startDate);
                  const end = formatDate(coh.endDate);
                  const modes = (coh.mode ?? []).filter(Boolean);
                  const modesDisplay = modes.length ? `(${modes.join(", ")})` : "(Mode TBA)";
                  const courseTitles = (coh.courseId ?? []).map(getCourseTitle);
                  const courseDisplay =
                    courseTitles.length > 0
                      ? courseTitles.join(", ")
                      : (coh.cohortName || "Cohort");

                  return (
                    <tr key={coh._id} className="transition hover:bg-gray-50">
                      <td className="border-r border-gray-200 px-6 py-4">
                        <div className="font-medium">{courseDisplay}</div>
                        <div className="mt-1 text-sm text-gray-500">{modesDisplay}</div>
                      </td>
                      <td className="border-r border-gray-200 px-6 py-4">{start}</td>
                      <td className="px-6 py-4">{end}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pager />
          </>
        )}
      </div>
    </main>
  );
}
