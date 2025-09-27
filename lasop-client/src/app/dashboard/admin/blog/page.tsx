// File: lasop-client/src/app/dashboard/admin/blog/page.tsx
'use client';

import React from 'react';
import { Trash2, Plus, Upload, Save, Edit2, X } from 'lucide-react';

type Blog = {
  _id: string;
  title: string;
  content: string;
  images: { url: string; filename: string }[];
  createdAt: string;
  updatedAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || '';

type NewPost = {
  title: string;
  content: string;
  files: File[];
};

export default function ManageBlogPage() {
  const [list, setList] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // dynamic multi-post form state
  const [posts, setPosts] = React.useState<NewPost[]>([{ title: '', content: '', files: [] }]);

  // edit modal
  const [editing, setEditing] = React.useState<Blog | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [editFiles, setEditFiles] = React.useState<File[]>([]);
  const [removeFiles, setRemoveFiles] = React.useState<Set<string>>(new Set());

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch(`${API}/blog`, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      setList(await res.json());
    } catch (e: any) {
      setErr(e?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const addPostForm = () => setPosts((p) => [...p, { title: '', content: '', files: [] }]);
  const removePostForm = (idx: number) => setPosts((p) => p.filter((_, i) => i !== idx));

  const updatePostField = (idx: number, key: keyof NewPost, value: any) =>
    setPosts((p) => p.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));

  const onFilesChange = (idx: number, files: FileList | null) => {
    if (!files) return;
    updatePostField(idx, 'files', Array.from(files));
  };

  const submitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = posts
      .map((p) => ({ title: p.title.trim(), content: p.content.trim() }))
      .filter((p) => p.title && p.content);

    if (!payload.length) return alert('Please fill at least one post');

    const fd = new FormData();
    fd.append('posts', JSON.stringify(payload));
    posts.forEach((p, i) => {
      (p.files || []).forEach((f) => fd.append(`images[${i}]`, f));
    });

    const res = await fetch(`${API}/blog/batch`, { method: 'POST', body: fd });
    if (!res.ok) {
      const t = await res.text();
      alert(`Failed: ${t}`);
      return;
    }
    setPosts([{ title: '', content: '', files: [] }]);
    await load();
    alert('Blog(s) created');
  };

  const startEdit = (b: Blog) => {
    setEditing(b);
    setEditTitle(b.title);
    setEditContent(b.content);
    setEditFiles([]);
    setRemoveFiles(new Set());
  };
  const toggleRemoveExisting = (filename: string) => {
    setRemoveFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };
  const saveEdit = async () => {
    if (!editing) return;
    const fd = new FormData();
    fd.append('title', editTitle);
    fd.append('content', editContent);
    editFiles.forEach((f) => fd.append('images[]', f));
    const remove = Array.from(removeFiles).join(',');
    const url = `${API}/blog/${editing._id}${remove ? `?remove=${encodeURIComponent(remove)}` : ''}`;
    const res = await fetch(url, { method: 'PUT', body: fd });
    if (!res.ok) {
      alert('Failed to update');
      return;
    }
    setEditing(null);
    await load();
    alert('Updated');
  };
  const del = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    const res = await fetch(`${API}/blog/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Failed to delete');
      return;
    }
    await load();
    alert('Deleted');
  };

  return (
    <main className="p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Blog</h1>

      {/* Create multiple posts at once */}
      <form onSubmit={submitBatch} className="space-y-6">
        {posts.map((p, idx) => (
          <div key={idx} className="border rounded-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Post #{idx + 1}</h3>
              {posts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePostForm(idx)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                  title="Remove this form"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-sm">Title</label>
                <input
                  className="border rounded-md h-10 px-2"
                  value={p.title}
                  onChange={(e) => updatePostField(idx, 'title', e.target.value)}
                  placeholder="Title"
                />
              </div>
              <div className="grid gap-1 md:col-span-2">
                <label className="text-sm">Content</label>
                <textarea
                  className="border rounded-md min-h-[100px] p-2"
                  value={p.content}
                  onChange={(e) => updatePostField(idx, 'content', e.target.value)}
                  placeholder="Write your content..."
                />
              </div>
              <div className="grid gap-1 md:col-span-2">
                <label className="text-sm">Images (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onFilesChange(idx, e.target.files)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addPostForm}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-md border"
            title="Add another post form"
          >
            <Plus className="w-4 h-4" /> Add another
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-accent text-white"
            title="Create all"
          >
            <Upload className="w-4 h-4" /> Post
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-8" />

      {/* List existing posts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {loading && <div>Loading…</div>}
        {err && <div className="text-red-600">{err}</div>}

        {list.map((b) => (
          <div key={b._id} className="border rounded-md p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{b.title}</h3>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center gap-1 px-3 h-9 border rounded-md"
                  onClick={() => startEdit(b)}
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1 px-3 h-9 border rounded-md text-red-600"
                  onClick={() => del(b._id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(b.createdAt).toLocaleString()}
            </div>
            <p className="line-clamp-3">{b.content}</p>
            <div className="grid grid-cols-3 gap-2">
              {b.images.map((img) => (
                <img
                  key={img.filename}
                  src={`${API}${img.url}`}
                  alt={b.title}
                  className="w-full h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-white w-full max-w-2xl rounded-md p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Edit Blog</h3>
              <button onClick={() => setEditing(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <label className="text-sm">Title</label>
                <input
                  className="border rounded-md h-10 px-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm">Content</label>
                <textarea
                  className="border rounded-md min-h-[120px] p-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Existing images (click to mark remove)</label>
                <div className="flex flex-wrap gap-2">
                  {editing.images.map((img) => {
                    const marked = removeFiles.has(img.filename);
                    return (
                      <button
                        type="button"
                        key={img.filename}
                        className={`relative rounded-md overflow-hidden border ${marked ? 'border-red-500' : 'border-transparent'}`}
                        onClick={() => toggleRemoveExisting(img.filename)}
                        title={marked ? 'Marked for removal' : 'Click to remove'}
                      >
                        <img
                          src={`${API}${img.url}`}
                          alt={editing.title}
                          className="w-24 h-20 object-cover"
                        />
                        {marked && (
                          <span className="absolute inset-0 bg-red-500/30 grid place-items-center text-white font-bold">
                            X
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm">Add more images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setEditFiles(Array.from(e.target.files || []))} />
              </div>

              <div className="flex gap-2 justify-end">
                <button className="px-4 h-10 border rounded-md" onClick={() => setEditing(null)}>Cancel</button>
                <button className="px-4 h-10 rounded-md bg-accent text-white inline-flex items-center gap-2" onClick={saveEdit}>
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
