// File: lasop-client/src/components/blog/BlogFormModal.tsx
'use client';

import React, { useState } from "react";
import type { Blog } from "@/lib/types/blog";

type Props = {
  apiBase: string;
  onCreated: (b: Blog) => void;
  onClose: () => void;
};

export default function BlogFormModal({ apiBase, onCreated, onClose }: Props) {
  const [form, setForm] = useState({ title: "", content: "", img: "", date: "", time: "" });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { title, content, img, date, time } = form;
    if (!title || !content || !img || !date || !time) { setErr("All fields are required."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/postBlog`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.text()) || `POST /postBlog failed: ${res.status}`);
      const json = await res.json();
      onCreated(json.data);
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-lg">Post a Blog</h4>
          <button onClick={onClose} className="text-sm border rounded-md px-2 py-1">Close</button>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-[12px]">Title</label>
            <input name="title" value={form.title} onChange={onChange} className="h-[36px] border rounded-md px-2" required />
          </div>
          <div className="grid gap-1">
            <label className="text-[12px]">Image URL</label>
            <input name="img" value={form.img} onChange={onChange} className="h-[36px] border rounded-md px-2" placeholder="https://…" required />
          </div>
          <div className="grid gap-1">
            <label className="text-[12px]">Date</label>
            <input name="date" value={form.date} onChange={onChange} className="h-[36px] border rounded-md px-2" placeholder="Sep 27, 2025" required />
          </div>
          <div className="grid gap-1">
            <label className="text-[12px]">Time</label>
            <input name="time" value={form.time} onChange={onChange} className="h-[36px] border rounded-md px-2" placeholder="10:30 AM" required />
          </div>
          <div className="grid gap-1">
            <label className="text-[12px]">Content</label>
            <textarea name="content" value={form.content} onChange={onChange} className="min-h-[120px] border rounded-md p-2" required />
          </div>
          {err && <p className="text-red-600 text-xs">{err}</p>}
          <button type="submit" disabled={submitting} className="h-[36px] bg-accent text-white rounded-md mt-1 disabled:opacity-60">
            {submitting ? "Posting…" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
