// File: lasop-client/src/app/blog/BlogMain.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { CiSearch } from 'react-icons/ci';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

type BlogDoc = {
  _id: string;
  title: string;
  content: string;
  images?: { url: string; filename: string }[];
  createdAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || '';

function BlogMain() {
  const [posts, setPosts] = React.useState<BlogDoc[]>([]);
  const [q, setQ] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API}/blog`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setPosts(Array.isArray(json) ? json : []);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = posts.filter((b) => {
    const s = q.toLowerCase();
    return (b.title || '').toLowerCase().includes(s) || (b.content || '').toLowerCase().includes(s);
  });

  return (
    <main>
      <section className="md:main py-[3rem] px-[30px]">
        <div className="latest_search grid md:flex md:items-center gap-3 justify-between">
          <h3 className="font-bold text-[30px] text-shadow">LATEST BLOG POSTS</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="latest_inp flex items-center w-[300px] h-[40px] border-2 border-shadow rounded-md">
              <input
                type="search"
                placeholder="Search..."
                className="w-[90%] h-full rounded-md p-2 outline-0"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <CiSearch className="font-bold text-shadow text-[20px]" />
            </div>
          </form>
        </div>
      </section>

      <section className="md:main py-[3rem] px-[30px]">
        {loading && <div className="text-sm text-gray-600">Loading…</div>}
        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="events_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
          {filtered.map((blog) => {
            const firstImg = blog.images?.[0];
            const created = blog.createdAt ? new Date(blog.createdAt) : null;

            return (
              <Link
                key={blog._id}
                href={`/blog/${blog._id}`}
                className="events_list w-full p-3 rounded-md flex flex-col gap-2 shadow-md shadow-slate-800 hover:shadow-xl transition"
              >
                <div className="events_img w-full">
                  {firstImg ? (
                    <img
                      className="w-full h-[250px] object-cover rounded-md"
                      src={`${API}${firstImg.url}`}
                      alt={blog.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-[250px] rounded-md bg-gray-100 grid place-items-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="events_info mt-auto">
                  <h3 className="head3 text-shadow">{blog.title}</h3>
                  <div className="events_publish flex items-center gap-4">
                    <div className="event_month flex items-center gap-2 text-[12px]">
                      <FaRegCalendarAlt className="text-shadow" />
                      <span>{created ? created.toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="event_time flex items-center gap-2 text-[12px]">
                      <FaRegClock className="text-shadow" />
                      <span>
                        {created
                          ? created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3">{blog.content}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="md:main py-[3rem] px-[30px] bg-secondary">
        <div className="subscribe grid md:flex md:items-center gap-3 md:justify-between">
          <h3 className="font-bold text-[40px] text-shadow">Subscribe to our Newsletter</h3>
          <form onSubmit={(e) => e.preventDefault()} className="grid sm:flex sm:items-center gap-3">
            <div className="sub_inp">
              <input
                type="email"
                className="w-[300px] h-[40px] rounded-md p-2 outline-0 bg-white"
                placeholder="Email Address"
              />
            </div>
            <div className="sub_btn">
              <button className="nav_btn bg-accent text-cyan-50" type="button">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default BlogMain;
