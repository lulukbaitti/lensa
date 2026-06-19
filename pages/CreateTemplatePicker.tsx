// src/pages/CreateTemplatePicker.tsx
// Klik template → langsung lanjut ke step foto (tanpa tombol lanjut).
// Warna background tetap bisa diubah sebelum memilih template.
import React from 'react';
import { TEMPLATES, BG_COLORS } from '../data/templates';
import { PhotostripPreview } from '../components/PhotostripPreview';
import { Info, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  bgColor: string;
  onBgChange: (color: string) => void;
}

export function CreateTemplatePicker({ selectedId, onSelect, bgColor, onBgChange }: Props) {
  const biasaTemplates = TEMPLATES.filter((t) => t.section === 'biasa');
  const igTemplates = TEMPLATES.filter((t) => t.section === 'instagram');

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-1">
      {/* Hint */}
      <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 text-sm text-pink-700 font-medium">
        <CheckCircle2 className="w-5 h-5 shrink-0 text-pink-500" />
        Pilih template di bawah — kamu langsung masuk ke step foto!
      </div>

      {/* Background Color Picker — di atas supaya bisa diatur dulu */}
      <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-pink-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#4A3728] mb-1">
              Pilih Warna Background Dulu
            </h2>
            <div className="text-[#6B503B] flex items-start gap-2 text-xs font-medium">
              <Info className="w-4 h-4 shrink-0 text-pink-400 mt-0.5" />
              Warna dasar template di belakang fotomu (bukan hapus bg foto ya!)
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {BG_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onBgChange(color)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-4 transition-transform ${
                  bgColor === color
                    ? 'border-pink-500 scale-110 shadow-lg'
                    : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Biasa */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b-2 border-pink-200 pb-3">
          <Layers className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg sm:text-2xl font-bold text-[#4A3728]">
            Strip Biasa (Memanjang){' '}
            <span className="text-pink-500 text-base font-medium">
              ({biasaTemplates.length} Pilihan)
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {biasaTemplates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isSelected={selectedId === t.id}
              onSelect={() => onSelect(t.id)}
              bgColor={selectedId === t.id ? bgColor : t.defaultBg}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Instagram */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b-2 border-pink-200 pb-3">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg sm:text-2xl font-bold text-[#4A3728]">
            Strip Instagram (Kotak){' '}
            <span className="text-pink-500 text-base font-medium">
              ({igTemplates.length} Pilihan)
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {igTemplates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              isSelected={selectedId === t.id}
              onSelect={() => onSelect(t.id)}
              bgColor={selectedId === t.id ? bgColor : t.defaultBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
  bgColor,
}: {
  template: any;
  isSelected: boolean;
  onSelect: () => void;
  bgColor: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 transition-all flex flex-col items-center gap-3 border-2 active:scale-95 ${
        isSelected
          ? 'bg-pink-50 border-pink-500 shadow-xl scale-[1.02]'
          : 'bg-white border-gray-100 hover:border-pink-300 hover:shadow-lg'
      }`}
    >
      {/* Preview area */}
      <div
        className="w-full flex justify-center overflow-hidden rounded-xl bg-gray-50 p-1.5 border border-gray-100"
        style={{ height: '180px' }}
      >
        <div className="origin-top" style={{ transform: 'scale(0.28)' }}>
          <PhotostripPreview
            template={template}
            bgColor={bgColor}
            photos={[]}
            watermark={false}
          />
        </div>
      </div>

      <div className="text-center w-full">
        <h4 className="font-bold text-[#4A3728] text-xs sm:text-sm truncate">
          {template.name}
        </h4>
        <p className="text-[10px] sm:text-xs text-[#6B503B] font-semibold mt-1 bg-gray-100/70 py-0.5 px-2 rounded-full inline-block">
          {template.frameCount} Foto · {template.frameShape === 'oval' ? '⭕ Oval' : '🔲 Kotak'}
        </p>
      </div>

      {isSelected && (
        <div className="flex items-center gap-1 text-pink-600 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Dipilih
        </div>
      )}
    </div>
  );
}
