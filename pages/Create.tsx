// src/pages/Create.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Template, Photo, Sticker, TextItem, Strip } from '../types';
import { TEMPLATES } from '../data/templates';
import { CreateTemplatePicker } from './CreateTemplatePicker';
import { CreateCapture } from './CreateCapture';
import { CreateDecorate } from './CreateDecorate';
import { gallery } from '../utils/store';
import { useAuth } from '../utils/useAuth';
import { Loader2 } from 'lucide-react';

export function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const editStrip = location.state?.editStrip as Strip | undefined;
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATES[0].id);
  const [bgColor, setBgColor] = useState<string>(TEMPLATES[0].defaultBg);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [texts, setTexts] = useState<TextItem[]>([]);

  useEffect(() => {
    if (editStrip) {
      setSelectedTemplateId(editStrip.templateId);
      setBgColor(editStrip.bgColor);
      setPhotos(editStrip.photos);
      setStickers(editStrip.stickers);
      setTexts(editStrip.texts);
      setStep(2);
    }
  }, [editStrip]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const template = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const t = TEMPLATES.find((x) => x.id === id);
    if (t) setBgColor(t.defaultBg);
    // Auto-lanjut ke step 2 saat template dipilih
    const frameCount = t?.frameCount ?? template.frameCount;
    setPhotos(Array(frameCount).fill(null));
    setTimeout(() => setStep(2), 150);
  };

  const handleNextToDecorate = () => setStep(3);

  const handleSave = async (finalDataUrl: string) => {
    if (!user) return;
    setSaving(true);
    try {
      const newStrip: Strip = {
        id: editStrip ? editStrip.id : Date.now().toString(),
        userId: user.id,
        templateId: template.id,
        bgColor,
        photos,
        stickers,
        texts,
        createdAt: editStrip ? editStrip.createdAt : Date.now(),
      };
      await gallery.saveStrip(newStrip, finalDataUrl);
      navigate('/gallery');
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <StepIndicator active={step >= 1} number={1} label="Template" />
          <div className={`w-8 sm:w-12 h-1 rounded-full ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <StepIndicator active={step >= 2} number={2} label="Foto" />
          <div className={`w-8 sm:w-12 h-1 rounded-full ${step >= 3 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <StepIndicator active={step >= 3} number={3} label="Hias" />
        </div>
      </div>

      {saving && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            <p className="font-bold text-gray-700">Menyimpan ke galeri...</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <CreateTemplatePicker
          selectedId={selectedTemplateId}
          onSelect={handleSelectTemplate}
          bgColor={bgColor}
          onBgChange={setBgColor}
        />
      )}

      {step === 2 && (
        <CreateCapture
          template={template}
          bgColor={bgColor}
          photos={photos}
          onPhotosChange={setPhotos}
          onBack={() => setStep(1)}
          onNext={handleNextToDecorate}
        />
      )}

      {step === 3 && (
        <CreateDecorate
          template={template}
          bgColor={bgColor}
          photos={photos}
          stickers={stickers}
          onStickersChange={setStickers}
          texts={texts}
          onTextsChange={setTexts}
          onBack={() => setStep(2)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StepIndicator({
  active,
  number,
  label,
}: {
  active: boolean;
  number: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-colors ${
          active ? 'bg-pink-600 text-white shadow-md shadow-pink-200' : 'bg-gray-100 text-gray-400'
        }`}
      >
        {number}
      </div>
      <span className={`text-xs sm:text-sm font-bold ${active ? 'text-pink-600' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
