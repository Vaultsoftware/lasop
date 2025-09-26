// ================================================
// File: src/app/terms/page.tsx  (SERVER COMPONENT)
// ================================================
import type { Metadata } from "next";
import Link from "next/link";
import TermsClient from "./TermsClient";
import { termsAndConditions } from "../../data/data"; // adjust if needed

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions • LASOP",
  description:
    "Read the official admission and study terms & conditions for Lagos School of Programming (LASOP). Enrollment, payments, attendance, facilities, and certifications.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "LASOP Terms & Conditions",
    description:
      "Official admission & study terms for LASOP: enrollment, payments, attendance, facilities, certifications.",
    url: "/terms",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: "LASOP Terms & Conditions" },
};

export default function Page() {
  const data = termsAndConditions?.[0];

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-red-600">
          Terms data not found. Ensure <code>src/data/data.ts</code> exports{" "}
          <code>termsAndConditions</code>.
        </p>
      </main>
    );
  }

  return (
    <>
      {/* Site chrome */}
      <Navbar />

      {/* Premium gradient backdrop */}
      <div className="from-gray-50 via-white to-white bg-gradient-to-b">
        <main id="top" className="relative">
          {/* Hero */}
          <section className="border-b bg-gradient-to-b from-white/40 to-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
              <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden>›</li>
                  <li className="text-gray-700">Terms & Conditions</li>
                </ol>
              </nav>

              <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur-xl md:p-8">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {data.title}
                </h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                  Read this agreement carefully. Enrollment and class participation
                  imply acceptance of these terms.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-1">
                    Official Policy
                  </span>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-1">
                    Applies to all centers
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive client section */}
          <TermsClient data={data} />
        </main>
      </div>

      <Footer />
    </>
  );
}