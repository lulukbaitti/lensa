// src/utils/store.ts
// Auth sepenuhnya via Supabase Auth (email+password bawaan Supabase)
// Gallery disimpan di tabel 'strips' di Supabase + gambar di Storage bucket 'strips'

import { supabase } from './supabase';
import type { Strip } from '../types';

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const auth = {
  /** Daftar akun baru */
  register: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }, // disimpan di user_metadata
    });
    if (error) throw new Error(error.message);
    return data;
  },

  /** Login */
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error('Email atau password salah.');
    return data;
  },

  /** Logout */
  logout: async () => {
    await supabase.auth.signOut();
  },

  /** Ambil user yang sedang login (sync, dari cache Supabase) */
  getCurrentUser: () => {
    // getSession() async, tapi untuk keperluan UI sync gunakan ini
    // Caller yang butuh async sebaiknya pakai supabase.auth.getUser()
    return supabase.auth.getUser();
  },

  /** Subscribe ke perubahan auth state */
  onAuthStateChange: (callback: (user: any) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return data.subscription;
  },
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────
// Tabel SQL yang dibutuhkan (jalankan di Supabase SQL Editor):
//
//  create table strips (
//    id          text primary key,
//    user_id     uuid references auth.users not null,
//    template_id text not null,
//    bg_color    text not null,
//    photos      jsonb not null default '[]',
//    stickers    jsonb not null default '[]',
//    texts       jsonb not null default '[]',
//    final_image text,          -- URL publik dari Storage
//    created_at  bigint not null
//  );
//
//  -- RLS: user hanya bisa baca/tulis strip milik sendiri
//  alter table strips enable row level security;
//  create policy "own strips" on strips
//    using (auth.uid() = user_id)
//    with check (auth.uid() = user_id);
//
// Storage bucket 'strips' harus dibuat dengan akses public read.

const BUCKET = 'strips';

/** Upload base64 dataUrl ke Supabase Storage, kembalikan public URL */
async function uploadImage(dataUrl: string, stripId: string): Promise<string> {
  // Konversi base64 ke Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const path = `${stripId}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

  if (error) throw new Error('Gagal upload gambar: ' + error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export const gallery = {
  /** Ambil semua strip milik user yang login */
  getUserStrips: async (): Promise<Strip[]> => {
    const { data, error } = await supabase
      .from('strips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      templateId: row.template_id,
      bgColor: row.bg_color,
      photos: row.photos,
      stickers: row.stickers,
      texts: row.texts,
      finalImage: row.final_image,
      createdAt: row.created_at,
    }));
  },

  /** Simpan strip (insert atau update) */
  saveStrip: async (strip: Strip, finalDataUrl: string): Promise<Strip> => {
    // Upload gambar ke Storage
    const publicUrl = await uploadImage(finalDataUrl, strip.id);

    const payload = {
      id: strip.id,
      template_id: strip.templateId,
      bg_color: strip.bgColor,
      photos: strip.photos,
      stickers: strip.stickers,
      texts: strip.texts,
      final_image: publicUrl,
      created_at: strip.createdAt,
    };

    const { error } = await supabase
      .from('strips')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw new Error(error.message);

    return { ...strip, finalImage: publicUrl };
  },

  /** Hapus strip + gambar dari Storage */
  deleteStrip: async (stripId: string): Promise<void> => {
    // Hapus dari storage
    await supabase.storage.from(BUCKET).remove([`${stripId}.jpg`]);

    const { error } = await supabase
      .from('strips')
      .delete()
      .eq('id', stripId);

    if (error) throw new Error(error.message);
  },
};
