export const runtime = 'nodejs';

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) throw new Error('Missing Supabase env vars');
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const supabase = supabaseAdmin();
    const form = await req.formData();

    const file = form.get('file') as File | null;
    const title = (form.get('title') as string) || null;
    const description = (form.get('description') as string) || null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
    }

    // Read file -> buffer -> SHA-256
    const arrayBuffer = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

    // Storage path + content type
    const path = `${Date.now()}_${file.name}`;
    const contentType = file.type || 'application/octet-stream';

    // Upload to private "evidence" bucket
    const { error: uploadErr } = await supabase.storage
      .from('evidence')
      .upload(path, buf, { contentType });

    if (uploadErr) {
      return new Response(JSON.stringify({ error: uploadErr.message }), { status: 500 });
    }

    // Insert DB row
    const { data: row, error: dbErr } = await supabase
      .from('evidence')
      .insert({
        title,
        description,
        storage_path: path,
        size_bytes: buf.length,
        mime_type: contentType,
        sha256,
        kind: 'file',
        entities: [],
      })
      .select()
      .single();

    if (dbErr) {
      return new Response(JSON.stringify({ error: dbErr.message }), { status: 500 });
    }

    // Append custody log
    await supabase.from('custody_log').insert({
      evidence_id: row.id,
      action: 'created',
      sha256,
    });

    return new Response(JSON.stringify({ ok: true, evidence: row }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Upload failed' }), { status: 500 });
  }
}
