'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CiSearch } from 'react-icons/ci';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

type Blog = {
  _id: string;
  title: string;
  content: string;
  images: { url: string; filename: string }[];
  createdAt: string;
};

const RAW_API = process.env.NEXT_PUBLIC_API_URL || '';
const API = RAW_API.replace(/\/+$/, '');
const IMAGE_BASE =
  (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '').replace(/\/+$/, '') ||
  API.replace(/\/api(?:\/v\\d+)?$/i, '');

// ✅ FIXED: Always return absolute URL (for live + local)
function toImg(p: string): string {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p; // already full
  const clean = p.startsWith('/') ? p : `/${p}`;
  return `${IMAGE_BASE}${clean}`;
}

const PER_PAGE = 5;

function makeExcerpt(text: string | undefined, words = 100): { excerpt: string; needsMore: boolean } {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return { excerpt: '', needsMore: false };
  const tokens = clean.split(' ');
  const needsMore = tokens.length > words;
  return { excerpt: needsMore ? tokens.slice(0, words).join(' ') + '…' : clean, needsMore };
}

function readingTime(text: string | undefined): number {
  const w = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(w / 200));
}

function CardSkeleton() {
  return (
    <div className="break-inside-avoid mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function BlogListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = React.useState<Blog[]>([]);
  const [q, setQ] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const pageFromUrl = Number(searchParams.get('page') || '1');
  const [page, setPage] = React.useState<number>(Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);

  React.useEffect(() => {
    const p = Number(searchParams.get('page') || '1');
    setPage(Number.isFinite(p) && p > 0 ? p : 1);
  }, [searchParams]);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`${API}/blog`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ql = q.toLowerCase();
  const filtered = data.filter(
    (b) => (b.title || '').toLowerCase().includes(ql) || (b.content || '').toLowerCase().includes(ql)
  );

  const totalPages = filtered.length <= PER_PAGE ? 1 : 1 + Math.ceil((filtered.length - PER_PAGE) / PER_PAGE);
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  const featured = filtered[0];
  const remaining = filtered.slice(1);

  let gridItems: Blog[] = [];
  if (safePage === 1) {
    gridItems = remaining.slice(0, Math.max(PER_PAGE - 1, 0));
  } else {
    const consumed = Math.max(PER_PAGE - 1, 0);
    const offset = consumed + (safePage - 2) * PER_PAGE;
    gridItems = remaining.slice(offset, offset + PER_PAGE);
  }

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete('page');
    else params.set('page', String(p));
    router.push(`?${params.toString()}`, { scroll: true });
  };

  const onSearchChange = (val: string) => {
    setQ(val);
    if (safePage !== 1) goToPage(1);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Premium hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400" />
        <div className="relative md:main px-[30px] py-14 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Insights & Stories</h1>
          <p className="mt-2 max-w-2xl text-white/90">Learn with our latest articles, tutorials, and announcements.</p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 max-w-xl">
            <label className="flex items-center gap-2 rounded-2xl bg-white/10 ring-1 ring-white/30 backdrop-blur px-3 h-12 focus-within:ring-2 focus-within:ring-white">
              <CiSearch className="text-white/80 text-xl" />
              <input
                type="search"
                value={q}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles, topics…"
                aria-label="Search blog"
                className="w-full bg-transparent outline-none placeholder:text-white/70 text-white"
              />
            </label>
          </form>
        </div>
      </section>

      {/* Featured card */}
      <section className="md:main px-[30px] -mt-10">
        {safePage === 1 && featured && (
          <Link
            href={`/blog/${featured._id}`}
            className="group no-underline block overflow-hidden rounded-3xl border bg-white shadow-xl hover:shadow-2xl transition"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative">
                {featured.images?.[0] ? (
                  <img
                    src={toImg(featured.images[0].url)}
                    alt={featured.title}
                    loading="lazy"
                    className="h-72 md:h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-72 md:h-full w-full grid place-items-center bg-gray-100 text-gray-400">No image</div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:underline">
                  {featured.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <FaRegCalendarAlt className="text-gray-500" />
                    {new Date(featured.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaRegClock className="text-gray-500" />
                    {readingTime(featured.content)} min read
                  </span>
                </div>
                <p className="mt-4 text-gray-700">{makeExcerpt(featured.content, 100).excerpt}</p>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Grid */}
      <section className="md:main px-[30px] py-10">
        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {gridItems.map((blog) => {
                const img = blog.images?.[0];
                const { excerpt, needsMore } = makeExcerpt(blog.content, 100);
                return (
                  <article key={blog._id} className="break-inside-avoid mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition">
                    <Link href={`/blog/${blog._id}`} className="group no-underline block">
                      {img ? (
                        <img className="w-full h-52 object-cover" src={toImg(img.url)} alt={blog.title} loading="lazy" />
                      ) : (
                        <div className="w-full h-52 bg-gray-100 grid place-items-center text-gray-400">No image</div>
                      )}
                    </Link>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold tracking-tight group-hover:underline">{blog.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-[12px] text-gray-600">
                        <span className="inline-flex items-center gap-2">
                          <FaRegCalendarAlt className="text-gray-500" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <FaRegClock className="text-gray-500" />
                          {readingTime(blog.content)} min read
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-700">
                        {excerpt}{' '}
                        {needsMore && (
                          <Link
                            href={`/blog/${blog._id}`}
                            className="font-semibold text-indigo-700 hover:underline no-underline"
                          >
                            Continue reading →
                          </Link>
                        )}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
