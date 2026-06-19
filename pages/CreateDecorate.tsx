import React, { useState, useRef } from 'react';
import { Template, Photo, Sticker, TextItem } from '../types';
import { STICKERS } from '../data/templates';
import { PhotostripPreview } from '../components/PhotostripPreview';
import { ArrowLeft, Save, Type, Smile, Trash2, Move } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface Props {
  template: Template;
  bgColor: string;
  photos: Photo[];
  stickers: Sticker[];
  onStickersChange: (stickers: Sticker[]) => void;
  texts: TextItem[];
  onTextsChange: (texts: TextItem[]) => void;
  onBack: () => void;
  onSave: (finalDataUrl: string) => void;
}

export function CreateDecorate({
  template,
  bgColor,
  photos,
  stickers,
  onStickersChange,
  texts,
  onTextsChange,
  onBack,
  onSave
}: Props) {
  const [activeTab, setActiveTab] = useState<'stickers' | 'text'>('stickers');
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Text Input State
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#FF69B4');
  const [textFont, setTextFont] = useState('Cherry Bomb One');

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: Math.floor(Math.random() * 40) - 20
    };
    onStickersChange([...stickers, newSticker]);
  };

  const addText = () => {
    if (!newText.trim()) return;
    const item: TextItem = {
      id: Date.now().toString(),
      text: newText,
      x: 50,
      y: 50,
      color: textColor,
      font: textFont,
      scale: 1
    };
    onTextsChange([...texts, item]);
    setNewText('');
  };

  const removeSticker = (id: string) =>
  onStickersChange(stickers.filter((s) => s.id !== id));
  const removeText = (id: string) =>
  onTextsChange(texts.filter((t) => t.id !== id));

  const handleSave = async () => {
    if (!previewRef.current) return;
    setIsSaving(true);
    try {
      const dataUrl = await htmlToImage.toJpeg(previewRef.current, {
        quality: 0.95,
        pixelRatio: 2
      });
      onSave(dataUrl);
    } catch (err) {
      console.error('Failed to save image', err);
      alert('Gagal menyimpan gambar. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Tools */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'stickers' ?
              'text-pink-600 border-b-2 border-pink-600 bg-pink-50/50' :
              'text-gray-500 hover:bg-gray-50'}`
              }
              onClick={() => setActiveTab('stickers')}>
              
              <Smile className="w-5 h-5" /> Stiker
            </button>
            <button
              className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'text' ?
              'text-pink-600 border-b-2 border-pink-600 bg-pink-50/50' :
              'text-gray-500 hover:bg-gray-50'}`
              }
              onClick={() => setActiveTab('text')}>
              
              <Type className="w-5 h-5" /> Teks
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'stickers' ?
            <div className="space-y-4">
                <p className="text-sm text-pink-600 font-medium mb-4 bg-pink-50 p-3 rounded-xl border border-pink-100">
                  ✨ Klik stiker untuk menambahkannya, lalu{' '}
                  <strong className="text-pink-800">GESER (drag)</strong> stiker
                  di area preview untuk mengatur posisinya!
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-4">
                  {STICKERS.map((emoji, i) =>
                <button
                  key={i}
                  onClick={() => addSticker(emoji)}
                  className="text-4xl hover:scale-125 transition-transform active:scale-95">
                  
                      {emoji}
                    </button>
                )}
                </div>

                {stickers.length > 0 &&
              <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                      Stiker Aktif (Klik untuk hapus)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stickers.map((s) =>
                  <button
                    key={s.id}
                    onClick={() => removeSticker(s.id)}
                    className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-sm flex items-center gap-1 hover:bg-red-100">
                    
                          {s.emoji} <Trash2 className="w-3 h-3" />
                        </button>
                  )}
                    </div>
                  </div>
              }
              </div> :

            <div className="space-y-5">
                <p className="text-sm text-pink-600 font-medium mb-2 bg-pink-50 p-3 rounded-xl border border-pink-100">
                  ✨ Tambahkan teks, lalu{' '}
                  <strong className="text-pink-800">GESER (drag)</strong> teks
                  di area preview untuk mengatur posisinya!
                </p>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Tulis Sesuatu
                  </label>
                  <div className="flex gap-2">
                    <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 outline-none"
                    placeholder="Misal: Besties Forever!" />
                  
                    <button
                    onClick={addText}
                    disabled={!newText.trim()}
                    className="px-6 py-2.5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 disabled:opacity-50">
                    
                      Tambah
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Warna
                    </label>
                    <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Font
                    </label>
                    <select
                    value={textFont}
                    onChange={(e) => setTextFont(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none">
                    
                      <option value="Cherry Bomb One">Cherry Bomb</option>
                      <option value="Pacifico">Pacifico</option>
                      <option value="Space Mono">Space Mono</option>
                      <option value="Inter">Inter</option>
                    </select>
                  </div>
                </div>

                {texts.length > 0 &&
              <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                      Teks Aktif (Klik untuk hapus)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {texts.map((t) =>
                  <button
                    key={t.id}
                    onClick={() => removeText(t.id)}
                    className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-sm flex items-center gap-1 hover:bg-red-100">
                    
                          "{t.text}" <Trash2 className="w-3 h-3" />
                        </button>
                  )}
                    </div>
                  </div>
              }
              </div>
            }
          </div>
        </div>
        {/* Tombol navigasi di sidebar sudah dihapus, hanya tools saja */}
      </div>

      {/* Right: Preview + Controls di bawah */}
      <div className="w-full lg:w-auto flex flex-col items-center">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 relative w-full max-w-lg">
          <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 z-10">
            <Move className="w-3 h-3" /> Preview Akhir
          </div>

          {/* The actual DOM node we capture */}
          <div className="overflow-hidden rounded-xl bg-gray-50 flex justify-center">
            <div
              className="origin-top"
              style={{
                transform: 'scale(0.55)',
                marginBottom: '-45%' // Compensate for scale
              }}>
              
              <PhotostripPreview
                ref={previewRef}
                template={template}
                bgColor={bgColor}
                photos={photos}
                stickers={stickers}
                texts={texts}
                watermark={true}
                interactive={true}
                onUpdateSticker={(id, updates) => {
                  onStickersChange(
                    stickers.map((s) =>
                    s.id === id ? { ...s, ...updates } : s
                    )
                  );
                }}
                onUpdateText={(id, updates) => {
                  onTextsChange(
                    texts.map((t) =>
                    t.id === id ? { ...t, ...updates } : t
                    )
                  );
                }} />
              
            </div>
          </div>
        </div>

        {/* Tombol aksi di bawah preview */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-lg">
          <button
            onClick={onBack}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all disabled:opacity-50">
            
            <ArrowLeft className="w-5 h-5" /> Retake
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-pink-600 text-white rounded-full font-bold text-lg hover:bg-pink-700 transition-all shadow-lg disabled:opacity-50">
            
            {isSaving ?
            'Menyimpan...' :

            <>
                Simpan ke Galeri <Save className="w-5 h-5" />
              </>
            }
          </button>
        </div>
      </div>
    </div>);

}