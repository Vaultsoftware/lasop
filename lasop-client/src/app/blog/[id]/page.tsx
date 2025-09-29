// File: src/app/blog/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';

type Blog = {
  _id: string;
  title: string;
  content: string;
  images: { url: string; filename: string }[];
  createdAt: string;
  updatedAt: string;
};

const RAW_API = process.env.NEXT_PUBLIC_API_URL || '';
const API = RAW_API.replace(/\/+$/, '');
const IMAGE_BASE =
  (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '').replace(/\/+$/, '') ||
  API.replace(/\/api(?:\/v\d+)?$/i, '');

function toImg(p: string): string {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${IMAGE_BASE}${path}`;
}

function readingTime(text: string | undefined): number {
  const w = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(w / 200));
}

export default function BlogDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [data, setData] = React.useState<Blog | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API}/blog/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        setData(await res.json());
      } catch (e: any) {
        setErr(e?.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="md:main py-[3rem] px-[30px]">Loading…</section>
        <Footer />
      </main>
    );
  }
  if (err) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="md:main py-[3rem] px-[30px] text-red-600">{err}</section>
        <Footer />
      </main>
    );
  }
  if (!data) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="md:main py-[3rem] px-[30px]">Not found</section>
        <Footer />
      </main>
    );
  }

  const created = new Date(data.createdAt);
  const banner = data.images?.[0];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Banner with overlay; added top padding so title clears navbar */}
      <section className="relative h-[40vh] min-h-[320px] max-h-[560px] pt-24 md:pt-28">
        {banner ? (
          <img
            src={toImg(banner.url)}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative md:main px-[30px] h-full grid content-end pb-8">
          <div className="max-w-3xl text-white">
            <Link href="/blog" className="text-sm text-white/80 hover:text-white no-underline">
              ← Back to Blog
            </Link>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight">{data.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/90">
              <span className="inline-flex items-center gap-2">
                <FaRegCalendarAlt />
                {created.toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-2">
                <FaRegClock />
                {readingTime(data.content)} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="md:main px-[30px] py-8">
        {Array.isArray(data.images) && data.images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.images.map((img) => (
              <figure key={img.filename} className="rounded-2xl overflow-hidden border bg-white">
                <img src={toImg(img.url)} alt={data.title} className="w-full h-60 object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
        ) : (
          <div className="w-full h-56 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">No image</div>
        )}
      </section>

      {/* Content */}
      <section className="md:main px-[30px] pb-14">
        <article className="mx-auto max-w-3xl prose prose-indigo max-w-none">
          <p className="whitespace-pre-line">{data.content}</p>
        </article>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: data.title,
            datePublished: data.createdAt,
            dateModified: data.updatedAt,
            image: (data.images || []).map((i) => toImg(i.url)),
          }),
        }}
      />

      <Footer />
    </main>
  );
}
