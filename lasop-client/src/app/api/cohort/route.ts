// src/app/api/cohort/route.ts
import { NextResponse } from "next/server";

const clean = (s?: string | null) => (s ?? "").replace(/\/+$/, "");

export async function GET() {
  const base = clean(process.env.BACKEND_API_URL) || clean(process.env.NEXT_PUBLIC_API_URL);
  const configured = (process.env.BACKEND_COHORT_PATH ?? "/getCohort").replace(/^\/?/, "/");
  if (!base) return NextResponse.json({ error: "Missing BACKEND_API_URL" }, { status: 500 });

  const candidates = [
    `${base}${configured}`,      // ✅ use your configured route
    `${base}/getCohort`,         // common in this codebase
    `${base}/cohort`,
    `${base}/cohorts`,
    `${base}/api/cohort`,
    `${base}/api/cohorts`,
    `${base}/api/v1/cohort`,
    `${base}/api/v1/cohorts`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      const text = await res.text();
      if (res.ok || res.status === 201) {
        return new NextResponse(text, {
          status: 200,
          headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
        });
      }
    } catch { /* ignore and try next */ }
  }
  return NextResponse.json(
    { error: "All backend cohort endpoints failed. Check BACKEND_COHORT_PATH." },
    { status: 502 }
  );
}
