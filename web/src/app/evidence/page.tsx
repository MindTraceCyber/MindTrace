'use client';
import { useState } from 'react';

export default function EvidencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function onUpload() {
    if (!file) return alert('Pick a file first');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (title) fd.append('title', title);
      if (description) fd.append('description', description);

      const res = await fetch('/api/evidence', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      alert('Uploaded!');
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-xl font-bold">Evidence Upload</h1>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <input className="border rounded p-2 block w-full" placeholder="Title (optional)"
             value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border rounded p-2 block w-full" placeholder="Description (optional)"
                value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={onUpload} disabled={loading || !file}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50">
        {loading ? 'Uploading…' : 'Upload'}
      </button>
    </main>
  );
}
