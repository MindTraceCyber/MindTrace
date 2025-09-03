'use server';

import crypto from 'crypto';
import { supabaseAdmin } from '../supabaseServer';

export async function createEvidence(params: {
  file: File;
  title?: string;
  description?: string;
}) {
  const { file, title, description } = params;
  const supabase = supabaseAdmin();

  // File -> buffer -> SHA-256
  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  const path = `${Date.now()}_${file.name}`;
  const contentType = file.type || 'application/octet-stream';

  // Upload to evidence bucket
  const { error: uploadErr } = await supabase.storage
    .from('evidence')
    .upload(path, buf, { contentType });

  if (uploadErr) throw uploadErr;

  // Insert DB row (adjust org/uploader later)
  const { data: row, error: dbErr } = await supabase
    .from('evidence')
    .insert({
      title: title ?? null,
      description: description ?? null,
      storage_path: path,
      size_bytes: buf.length,
      mime_type: contentType,
      sha256,
      kind: 'file',
      entities: [],
    })
    .select()
    .single();

  if (dbErr) throw dbErr;

  // Custody log
  const { error: custodyErr } = await supabase.from('custody_log').insert({
    evidence_id: row.id,
    action: 'created',
    sha256,
  });
  if (custodyErr) throw custodyErr;

  return row;
}
