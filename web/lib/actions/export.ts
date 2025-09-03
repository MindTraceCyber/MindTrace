'use server';

import { supabaseAdmin } from '../supabaseServer';

export async function saveExport(pdfBlob: Blob) {
  const supabase = supabaseAdmin();
  const path = `export_${Date.now()}.pdf`;

  const { error: uploadErr } = await supabase.storage
    .from('exports')
    .upload(path, pdfBlob, { contentType: 'application/pdf' });

  if (uploadErr) throw uploadErr;

  const { error: dbErr } = await supabase
    .from('exports')
    .insert({
      format: 'pdf',
      storage_path: path,
      scope: {},
      incomplete: false,
    });

  if (dbErr) throw dbErr;

  return { path };
}
