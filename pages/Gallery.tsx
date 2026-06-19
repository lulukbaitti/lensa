// src/pages/Gallery.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Strip } from '../types';
import { gallery } from '../utils/store';
import { Download, Trash2, Edit3, Image as ImageIcon, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '../utils/useAuth';

export function Gallery() {
  const [strips, setStrips] = useState<Strip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { displayName } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      const data = await gallery.getUserStrips();
      setStrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (stripId: string) => {
    if (!window.confirm('Yakin ingin menghapus photostrip ini?')) return;
    setDeletingId(stripId);
    try {
      await gallery.deleteStrip(stripId);
      setStrips((prev) => prev.filter((s) => s.id !== stripId));
    } catch (err) {
      alert('Gagal menghapus. Coba lagi.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (strip: Strip) => {
    if (!strip.finalImage) return;
    const res = await fetch(strip.finalImage);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `LensaLoka-${strip.id}.jpg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = (strip: Strip) => {
    navigate('/create', { state: { editStrip: strip } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (strips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-6">
          <ImageIcon className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-['Cherry_Bomb_One'] text-gray-900 mb-2">
          Galeri Masih Kosong
        </h2>
        <p className="text-gray-500 mb-8 max-w-md text-sm sm:text-base">
          Kamu belum membuat photostrip apapun. Yuk mulai abadikan momen lucumu sekarang!
        </p>
        <button
          onClick={() => navigate('/create')}
          className="px-8 py-3 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition-all shadow-md"
        >
          Buat Strip Pertamamu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between border-b border-pink-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-['Cherry_Bomb_One'] text-gray-900">
            Galeri Kamu
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Koleksi kenangan manis {displayName}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100 font-bold text-pink-600 text-sm">
          {strips.length} Strip
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {strips.map((strip) => (
          <div
            key={strip.id}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all group"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 aspect-[2/3] mb-3 border border-gray-100">
              {strip.finalImage ? (
                <img
                  src={strip.finalImage}
                  alt="Photostrip"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Gambar tidak tersedia
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3 backdrop-blur-[2px]">
                <button
                  onClick={() => handleDownload(strip)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-110 hover:text-pink-600 transition-all shadow-lg"
                  title="Download"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleEdit(strip)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:scale-110 hover:text-blue-600 transition-all shadow-lg"
                  title="Edit Ulang"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {format(strip.createdAt, 'dd MMM yy', { locale: id })}
              </div>
              <button
                onClick={() => handleDelete(strip.id)}
                disabled={deletingId === strip.id}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                title="Hapus"
              >
                {deletingId === strip.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
